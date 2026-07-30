library(readxl)
library(dplyr)
library(lubridate)
library(fixest)
library(broom)
library(jsonlite)




# Load data


bc <- read.csv(
  "C:/Users/parsi/Downloads/forecast/NWT-Tax-income-forecast-/drugdata.csv"
)


ab <- read_excel(
  "C:/Users/parsi/Downloads/forecast/NWT-Tax-income-forecast-/drugdataab.csv.xlsx"
)




# Create panel data


bc <- bc %>%
  mutate(
    date = make_date(DeathYear, Month, 1),
    province = "BC"
  )


ab <- ab %>%
  mutate(
    date = make_date(DeathYear, Month, 1),
    province = "AB"
  )


data <- bind_rows(bc, ab)




# Create variables


data <- data %>%
  arrange(province, date) %>%
  mutate(
    time = as.numeric(
      difftime(date, min(date), units="days")
    ) / 30,
    
    BC = ifelse(province == "BC", 1, 0)
  )




# Event time
# July 2023 = 0
# (6-month lag after Jan 2023 policy)


data <- data %>%
  mutate(
    event_time =
      (year(date)-2023)*12 +
      month(date)-7
  )




# Event window


data <- data %>%
  mutate(
    event_bin = case_when(
      
      event_time <= -12 ~ -12,
      
      event_time >= 18 ~ 18,
      
      TRUE ~ event_time
      
    ),
    
    event_bin = as.character(event_bin)
    
  )



data$event_bin <- factor(
  data$event_bin,
  levels=c(
    "-12",
    as.character(-11:17),
    "18"
  )
)



# Check observations

print(table(data$event_bin, data$province))




# Difference-in-Differences Event Study


event_model <- feols(
  
  fpc ~ 
    i(event_bin, BC, ref="-1") +
    time
  
  | province,
  
  panel.id = ~province + date,
  
  vcov = "NW",
  
  data=data
  
)



summary(event_model)




# Extract and save results


event_results <- broom::tidy(
  event_model,
  conf.int = TRUE
) %>%
  
  filter(
    grepl("event_bin::", term)
  ) %>%
  
  mutate(
    
    event_time = gsub("event_bin::", "", term),
    
    event_time = as.numeric(
      gsub(":BC", "", event_time)
    )
    
  ) %>%
  
  select(
    event_time,
    estimate,
    std.error,
    conf.low,
    conf.high,
    p.value
  ) %>%
  
  arrange(event_time)



# Add reference period (-1)
# normalized to zero

event_results <- bind_rows(
  
  data.frame(
    event_time = -1,
    estimate = 0,
    std.error = NA,
    conf.low = NA,
    conf.high = NA,
    p.value = NA
  ),
  
  event_results
  
) %>%
  
  arrange(event_time)




# Save JSON


write_json(
  
  event_results,
  
  "C:/Users/parsi/Downloads/forecast/NWT-Tax-income-forecast-/exports/BCAB_eventstudy.json",
  
  pretty = TRUE
  
)



print(event_results)