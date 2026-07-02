library(readr)
library(dplyr)
library(lubridate)
library(ggplot2)
library(broom)
library(scales)
library(jsonlite)

drug <- read_csv("/drugdata.csv")

drug <- drug %>%
  mutate(
    date = as.Date(paste(DeathYear, Month, "01", sep = "-")),
    deaths = as.numeric(Frequency)
  ) %>%
  arrange(date) %>%
  filter(deaths > 0) %>%
  mutate(
    time = row_number() - 1
  )

policy_start <- as.Date("2023-01-01")
policy_end <- as.Date("2026-01-01")

run_policy_model <- function(data, lag_months) {
  effect_start <- policy_start %m+% months(lag_months)
  
  model_data <- data %>%
    mutate(
      policy_effect = if_else(date >= effect_start & date < policy_end, 1, 0),
      effect_start_index = which(date >= effect_start)[1] - 1,
      policy_effect_time = if_else(
        policy_effect == 1,
        time - effect_start_index,
        0
      ),
      log_deaths = log(deaths)
    )
  
  model <- lm(
    log_deaths ~ time + policy_effect + policy_effect_time,
    data = model_data
  )
  
  coef_table <- tidy(model)
  
  p_time <- coef_table %>%
    filter(term == "time") %>%
    pull(p.value)
  
  p_policy <- coef_table %>%
    filter(term == "policy_effect") %>%
    pull(p.value)
  
  p_policy_time <- coef_table %>%
    filter(term == "policy_effect_time") %>%
    pull(p.value)
  
  model_data <- model_data %>%
    mutate(
      fitted_log_deaths = predict(model, newdata = model_data),
      counterfactual_log_deaths = coef(model)[["(Intercept)"]] +
        coef(model)[["time"]] * time,
      fitted_deaths = exp(fitted_log_deaths),
      counterfactual_deaths = exp(counterfactual_log_deaths),
      observed_percent_difference = if_else(
        date >= effect_start & date < policy_end,
        ((deaths - counterfactual_deaths) / counterfactual_deaths) * 100,
        NA_real_
      ),
      model_percent_difference = if_else(
        date >= effect_start & date < policy_end,
        ((fitted_deaths - counterfactual_deaths) / counterfactual_deaths) * 100,
        NA_real_
      )
    )
  
  coef_values <- coef(model)
  
  tibble(
    lag_months = lag_months,
    effect_start = effect_start,
    
    intercept = coef_values[["(Intercept)"]],
    
    baseline_monthly_percent_trend =
      (exp(coef_values[["time"]]) - 1) * 100,
    baseline_p_value = p_time,
    baseline_sig = sig_stars(p_time),
    
    immediate_policy_percent_change =
      (exp(coef_values[["policy_effect"]]) - 1) * 100,
    immediate_policy_p_value = p_policy,
    immediate_policy_sig = sig_stars(p_policy),
    
    policy_monthly_percent_trend_change =
      (exp(coef_values[["policy_effect_time"]]) - 1) * 100,
    policy_trend_p_value = p_policy_time,
    policy_trend_sig = sig_stars(p_policy_time),
    
    total_policy_monthly_percent_trend =
      (exp(coef_values[["time"]] + coef_values[["policy_effect_time"]]) - 1) * 100,
    
    average_model_percent_difference =
      mean(model_data$model_percent_difference, na.rm = TRUE),
    
    model = list(model),
    data = list(model_data)
  )
}


sig_stars <- function(p) {
  case_when(
    p < 0.05 ~ "***",
    p < 0.10 ~ "**",
    p < 0.15 ~ "*",
    TRUE ~ ""
  )
}

model_0 <- run_policy_model(drug, 0)
model_3 <- run_policy_model(drug, 3)
model_6 <- run_policy_model(drug, 6)
model_9 <- run_policy_model(drug, 9)
model_10 <- run_policy_model(drug, 10)
model_11 <- run_policy_model(drug, 11)
model_12 <- run_policy_model(drug, 12)

main_model <- model_6
main_lm <- main_model$model[[1]]

plot_data <- main_model$data[[1]]



sig_stars <- function(p) {
  case_when(
    p < 0.01 ~ "***",
    p < 0.05 ~ "**",
    p < 0.10 ~ "*",
    TRUE ~ ""
  )
}

export_folder <- "C:/Users/parsi/Downloads/forecast/NWT-Tax-income-forecast-/exports"

if (!dir.exists(export_folder)) {
  dir.create(export_folder, recursive = TRUE)
}

sensitivity_export <- bind_rows(
  model_0 %>% select(-model, -data),
  model_3 %>% select(-model, -data),
  model_6 %>% select(-model, -data),
  model_9 %>% select(-model, -data),
  model_12 %>% select(-model, -data)
) %>%
  mutate(
    effect_start = as.character(effect_start),
    baseline_result = paste0(
      round(baseline_monthly_percent_trend, 2),
      baseline_sig
    ),
    immediate_policy_result = paste0(
      round(immediate_policy_percent_change, 2),
      immediate_policy_sig
    ),
    policy_trend_result = paste0(
      round(policy_monthly_percent_trend_change, 2),
      policy_trend_sig
    ),
    total_policy_monthly_percent_trend = round(total_policy_monthly_percent_trend, 2),
    average_model_percent_difference = round(average_model_percent_difference, 2)
  )

write_csv(
  sensitivity_export,
  file.path(export_folder, "policy_sensitivity_analysis.csv")
)

write_json(
  sensitivity_export,
  file.path(export_folder, "policy_sensitivity_analysis.json"),
  pretty = TRUE,
  dataframe = "rows",
  auto_unbox = TRUE
)

main_model_export <- plot_data %>%
  mutate(
    date = as.character(date),
    deaths = round(deaths, 2),
    fitted_deaths = round(fitted_deaths, 2),
    counterfactual_deaths = round(counterfactual_deaths, 2),
    observed_percent_difference = round(observed_percent_difference, 2),
    model_percent_difference = round(model_percent_difference, 2)
  ) %>%
  select(
    date,
    deaths,
    fitted_deaths,
    counterfactual_deaths,
    observed_percent_difference,
    model_percent_difference,
    policy_effect,
    policy_effect_time
  )

write_csv(
  main_model_export,
  file.path(export_folder, "policy_main_model_plot_data.csv")
)

write_json(
  main_model_export,
  file.path(export_folder, "policy_main_model_plot_data.json"),
  pretty = TRUE,
  dataframe = "rows",
  auto_unbox = TRUE
)

main_model_summary <- tibble(
  main_lag_months = main_model$lag_months[[1]],
  effect_start = as.character(main_model$effect_start[[1]]),
  baseline_monthly_percent_trend = round(main_model$baseline_monthly_percent_trend[[1]], 2),
  immediate_policy_percent_change = round(main_model$immediate_policy_percent_change[[1]], 2),
  policy_monthly_percent_trend_change = round(main_model$policy_monthly_percent_trend_change[[1]], 2),
  total_policy_monthly_percent_trend = round(main_model$total_policy_monthly_percent_trend[[1]], 2),
  average_model_percent_difference = round(main_model$average_model_percent_difference[[1]], 2)
)

write_json(
  main_model_summary,
  file.path(export_folder, "policy_main_model_summary.json"),
  pretty = TRUE,
  dataframe = "rows",
  auto_unbox = TRUE
)
