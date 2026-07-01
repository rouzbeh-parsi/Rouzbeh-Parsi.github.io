---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
mathjax: false
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="debug"></div>
<div id="drug_chart" style="width:105%;height:650px;"></div>

<script>
window.DRUG_DATA = {{ site.data.drug | jsonify }};
</script>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        document.getElementById("debug").innerHTML = "Error: No data found.";
        return;
    }

    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    function fitLine(points) {
        const n = points.length;

        if (n < 2) {
            return { slope: 0, intercept: points.length ? points[0].y : 0 };
        }

        const sumX = points.reduce(function (total, point) {
            return total + point.t;
        }, 0);

        const sumY = points.reduce(function (total, point) {
            return total + point.y;
        }, 0);

        const sumXY = points.reduce(function (total, point) {
            return total + point.t * point.y;
        }, 0);

        const sumXX = points.reduce(function (total, point) {
            return total + point.t * point.t;
        }, 0);

        const denominator = n * sumXX - sumX * sumX;

        if (denominator === 0) {
            return { slope: 0, intercept: sumY / n };
        }

        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;

        return { slope: slope, intercept: intercept };
    }

    const indexedData = x.map(function (date, i) {
        return {
            date: date,
            t: i,
            y: y[i]
        };
    });

    const prePolicyData = indexedData.filter(function (d) {
        return d.date < policyStart;
    });

    const postPolicyData = indexedData.filter(function (d) {
        return d.date >= policyStart;
    });

    const prePolicyModel = fitLine(prePolicyData);
    const postPolicyModel = fitLine(postPolicyData);

    const prePolicyTrendY = prePolicyData.map(function (d) {
        return prePolicyModel.slope * d.t + prePolicyModel.intercept;
    });

    const counterfactualY = postPolicyData.map(function (d) {
        return prePolicyModel.slope * d.t + prePolicyModel.intercept;
    });

    const postPolicyTrendY = postPolicyData.map(function (d) {
        return postPolicyModel.slope * d.t + postPolicyModel.intercept;
    });

    Plotly.newPlot("drug_chart", [
        {
            x: x,
            y: y,
            mode: "lines+markers",
            name: "Observed deaths",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 }
        },
        {
            x: prePolicyData.map(function (d) { return d.date; }),
            y: prePolicyTrendY,
            mode: "lines",
            name: "Pre-policy trend",
            line: { color: "#111827", width: 3 }
        },
        {
            x: postPolicyData.map(function (d) { return d.date; }),
            y: counterfactualY,
            mode: "lines",
            name: "Counterfactual from pre-policy trend",
            line: { color: "#6b7280", width: 3, dash: "dash" }
        },
        {
            x: postPolicyData.map(function (d) { return d.date; }),
            y: postPolicyTrendY,
            mode: "lines",
            name: "Post-policy trend",
            line: { color: "#dc2626", width: 3 }
        }
    ], {
        title: {
            text: "Drug-related Deaths in BC",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: {
            color: "#222"
        },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: {
                text: "Date",
                font: { size: 16, color: "#222" }
            },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: {
                text: "Deaths",
                font: { size: 16, color: "#222" }
            },
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start (2023)",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End (2026)",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });
    });
</script>


<div id="policy_percent_chart" style="width:100%;height:650px;"></div>

<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        return;
    }

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const logY = y.map(function (value) {
        return Math.log(value);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    function transpose(matrix) {
        return matrix[0].map(function (_, columnIndex) {
            return matrix.map(function (row) {
                return row[columnIndex];
            });
        });
    }

    function multiplyMatrices(a, b) {
        return a.map(function (row) {
            return b[0].map(function (_, columnIndex) {
                return row.reduce(function (sum, value, i) {
                    return sum + value * b[i][columnIndex];
                }, 0);
            });
        });
    }

    function invertMatrix(matrix) {
        const n = matrix.length;
        const augmented = matrix.map(function (row, i) {
            return row.concat(
                Array.from({ length: n }, function (_, j) {
                    return i === j ? 1 : 0;
                })
            );
        });

        for (let i = 0; i < n; i++) {
            let pivot = augmented[i][i];

            if (Math.abs(pivot) < 1e-12) {
                for (let r = i + 1; r < n; r++) {
                    if (Math.abs(augmented[r][i]) > Math.abs(pivot)) {
                        const temp = augmented[i];
                        augmented[i] = augmented[r];
                        augmented[r] = temp;
                        pivot = augmented[i][i];
                        break;
                    }
                }
            }

            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] = augmented[i][j] / pivot;
            }

            for (let r = 0; r < n; r++) {
                if (r !== i) {
                    const factor = augmented[r][i];

                    for (let c = 0; c < 2 * n; c++) {
                        augmented[r][c] = augmented[r][c] - factor * augmented[i][c];
                    }
                }
            }
        }

        return augmented.map(function (row) {
            return row.slice(n);
        });
    }

    function linearRegression(designMatrix, response) {
        const yMatrix = response.map(function (value) {
            return [value];
        });

        const xTranspose = transpose(designMatrix);
        const xtx = multiplyMatrices(xTranspose, designMatrix);
        const xtxInverse = invertMatrix(xtx);
        const xty = multiplyMatrices(xTranspose, yMatrix);
        const coefficients = multiplyMatrices(xtxInverse, xty);

        return coefficients.map(function (row) {
            return row[0];
        });
    }

    const policyStartIndex = x.findIndex(function (date) {
        return date >= policyStart;
    });

    const regressionRows = x.map(function (date, i) {
        const inPolicyPeriod = date >= policyStart && date < policyEnd;
        const policyTime = inPolicyPeriod ? i - policyStartIndex : 0;

        return {
            date: date,
            time: i,
            policy: inPolicyPeriod ? 1 : 0,
            policyTime: policyTime
        };
    });

    const designMatrix = regressionRows.map(function (row) {
        return [
            1,
            row.time,
            row.policy,
            row.policyTime
        ];
    });

    const coefficients = linearRegression(designMatrix, logY);

    const intercept = coefficients[0];
    const baselineTrend = coefficients[1];
    const policyLevelChange = coefficients[2];
    const policyTrendChange = coefficients[3];

    const fittedLogDeaths = regressionRows.map(function (row) {
        return (
            intercept +
            baselineTrend * row.time +
            policyLevelChange * row.policy +
            policyTrendChange * row.policyTime
        );
    });

    const counterfactualLogDeaths = regressionRows.map(function (row) {
        return intercept + baselineTrend * row.time;
    });

    const fittedDeaths = fittedLogDeaths.map(function (value) {
        return Math.exp(value);
    });

    const counterfactualDeaths = counterfactualLogDeaths.map(function (value) {
        return Math.exp(value);
    });

    const observedPercentDifference = regressionRows.map(function (row, i) {
        if (row.date < policyStart || row.date >= policyEnd) {
            return null;
        }

        return ((y[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
    });

    const modelPercentDifference = regressionRows.map(function (row, i) {
        if (row.date < policyStart || row.date >= policyEnd) {
            return null;
        }

        return ((fittedDeaths[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
    });

    const immediatePolicyPercentChange = (Math.exp(policyLevelChange) - 1) * 100;
    const baselineMonthlyPercentTrend = (Math.exp(baselineTrend) - 1) * 100;
    const policyMonthlyPercentTrendChange = (Math.exp(policyTrendChange) - 1) * 100;

    document.getElementById("debug").innerHTML =
        "Baseline monthly trend: " + baselineMonthlyPercentTrend.toFixed(2) +
        "% per month<br>" +
        "Immediate policy-period level change: " + immediatePolicyPercentChange.toFixed(2) +
        "%<br>" +
        "Policy-period trend change: " + policyMonthlyPercentTrendChange.toFixed(2) +
        "% per month";

    Plotly.newPlot("policy_percent_chart", [
        {
            x: x,
            y: observedPercentDifference,
            mode: "lines+markers",
            name: "Observed difference from expected",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 },
            hovertemplate: "%{x|%b %Y}<br>Observed: %{y:.1f}%<extra></extra>"
        },
        {
            x: x,
            y: modelPercentDifference,
            mode: "lines",
            name: "Model-estimated policy effect",
            line: { color: "#dc2626", width: 3 },
            hovertemplate: "%{x|%b %Y}<br>Model effect: %{y:.1f}%<extra></extra>"
        }
    ], {
        title: {
            text: "Estimated Policy Effect as Percent Difference from Expected Deaths",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: { color: "#222" },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: { text: "Date", font: { size: 16, color: "#222" } },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: { text: "Percent Difference from Expected Deaths", font: { size: 16, color: "#222" } },
            ticksuffix: "%",
            zeroline: true,
            zerolinecolor: "#111827",
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });
});
</script>


<div id="policy_regression_results" style="margin: 1.5rem 0; padding: 1rem; border: 1px solid #ddd; background: #fafafa;"></div>
<div id="policy_percent_chart" style="width:100%;height:650px;"></div>

<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        return;
    }

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const validData = x.map(function (date, i) {
        return {
            date: date,
            deaths: y[i]
        };
    }).filter(function (row) {
        return row.deaths > 0;
    });

    const modelDates = validData.map(function (row) {
        return row.date;
    });

    const observedDeaths = validData.map(function (row) {
        return row.deaths;
    });

    const logDeaths = observedDeaths.map(function (value) {
        return Math.log(value);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    function transpose(matrix) {
        return matrix[0].map(function (_, columnIndex) {
            return matrix.map(function (row) {
                return row[columnIndex];
            });
        });
    }

    function multiplyMatrices(a, b) {
        return a.map(function (row) {
            return b[0].map(function (_, columnIndex) {
                return row.reduce(function (sum, value, i) {
                    return sum + value * b[i][columnIndex];
                }, 0);
            });
        });
    }

    function invertMatrix(matrix) {
        const n = matrix.length;
        const augmented = matrix.map(function (row, i) {
            return row.concat(
                Array.from({ length: n }, function (_, j) {
                    return i === j ? 1 : 0;
                })
            );
        });

        for (let i = 0; i < n; i++) {
            let pivot = augmented[i][i];

            if (Math.abs(pivot) < 1e-12) {
                for (let r = i + 1; r < n; r++) {
                    if (Math.abs(augmented[r][i]) > Math.abs(pivot)) {
                        const temp = augmented[i];
                        augmented[i] = augmented[r];
                        augmented[r] = temp;
                        pivot = augmented[i][i];
                        break;
                    }
                }
            }

            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] = augmented[i][j] / pivot;
            }

            for (let r = 0; r < n; r++) {
                if (r !== i) {
                    const factor = augmented[r][i];

                    for (let c = 0; c < 2 * n; c++) {
                        augmented[r][c] = augmented[r][c] - factor * augmented[i][c];
                    }
                }
            }
        }

        return augmented.map(function (row) {
            return row.slice(n);
        });
    }

    function linearRegression(designMatrix, response) {
        const yMatrix = response.map(function (value) {
            return [value];
        });

        const xTranspose = transpose(designMatrix);
        const xtx = multiplyMatrices(xTranspose, designMatrix);
        const xtxInverse = invertMatrix(xtx);
        const xty = multiplyMatrices(xTranspose, yMatrix);
        const coefficients = multiplyMatrices(xtxInverse, xty);

        return coefficients.map(function (row) {
            return row[0];
        });
    }

    const policyStartIndex = modelDates.findIndex(function (date) {
        return date >= policyStart;
    });

    const regressionRows = modelDates.map(function (date, i) {
        const inPolicyPeriod = date >= policyStart && date < policyEnd;
        const policyTime = inPolicyPeriod ? i - policyStartIndex : 0;

        return {
            date: date,
            time: i,
            policy: inPolicyPeriod ? 1 : 0,
            policyTime: policyTime
        };
    });

    const designMatrix = regressionRows.map(function (row) {
        return [
            1,
            row.time,
            row.policy,
            row.policyTime
        ];
    });

    const coefficients = linearRegression(designMatrix, logDeaths);

    const intercept = coefficients[0];
    const baselineTrend = coefficients[1];
    const policyLevelChange = coefficients[2];
    const policyTrendChange = coefficients[3];

    const fittedLogDeaths = regressionRows.map(function (row) {
        return (
            intercept +
            baselineTrend * row.time +
            policyLevelChange * row.policy +
            policyTrendChange * row.policyTime
        );
    });

    const counterfactualLogDeaths = regressionRows.map(function (row) {
        return intercept + baselineTrend * row.time;
    });

    const fittedDeaths = fittedLogDeaths.map(function (value) {
        return Math.exp(value);
    });

    const counterfactualDeaths = counterfactualLogDeaths.map(function (value) {
        return Math.exp(value);
    });

    const observedPercentDifference = regressionRows.map(function (row, i) {
        if (row.date < policyStart || row.date >= policyEnd) {
            return null;
        }

        return ((observedDeaths[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
    });

    const modelPercentDifference = regressionRows.map(function (row, i) {
        if (row.date < policyStart || row.date >= policyEnd) {
            return null;
        }

        return ((fittedDeaths[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
    });

    const immediatePolicyPercentChange = (Math.exp(policyLevelChange) - 1) * 100;
    const baselineMonthlyPercentTrend = (Math.exp(baselineTrend) - 1) * 100;
    const policyMonthlyPercentTrendChange = (Math.exp(policyTrendChange) - 1) * 100;
    const policyMonthlyPercentTrend = (Math.exp(baselineTrend + policyTrendChange) - 1) * 100;

    const policyObservedValues = observedPercentDifference.filter(function (value) {
        return value !== null;
    });

    const policyModelValues = modelPercentDifference.filter(function (value) {
        return value !== null;
    });

    const averageObservedPercentDifference =
        policyObservedValues.reduce(function (total, value) {
            return total + value;
        }, 0) / policyObservedValues.length;

    const averageModelPercentDifference =
        policyModelValues.reduce(function (total, value) {
            return total + value;
        }, 0) / policyModelValues.length;

    let levelInterpretation = "higher";
    if (immediatePolicyPercentChange < 0) {
        levelInterpretation = "lower";
    }

    let trendInterpretation = "increased";
    if (policyMonthlyPercentTrendChange < 0) {
        trendInterpretation = "decreased";
    }

    document.getElementById("policy_regression_results").innerHTML =
        "<h3>Interrupted Time-Series Regression Results</h3>" +
        "<p><strong>Model:</strong> log(Deaths) = β0 + β1 Time + β2 Policy + β3 PolicyTime</p>" +
        "<ul>" +
        "<li><strong>Constant β0:</strong> " + intercept.toFixed(3) + "</li>" +
        "<li><strong>Baseline monthly trend β1:</strong> " + baselineMonthlyPercentTrend.toFixed(2) + "% per month</li>" +
        "<li><strong>Immediate policy-period change β2:</strong> " + immediatePolicyPercentChange.toFixed(2) + "%</li>" +
        "<li><strong>Policy-period trend change β3:</strong> " + policyMonthlyPercentTrendChange.toFixed(2) + "% per month</li>" +
        "<li><strong>Total monthly trend during policy:</strong> " + policyMonthlyPercentTrend.toFixed(2) + "% per month</li>" +
        "<li><strong>Average observed difference from expected during policy:</strong> " + averageObservedPercentDifference.toFixed(2) + "%</li>" +
        "<li><strong>Average model-estimated policy effect:</strong> " + averageModelPercentDifference.toFixed(2) + "%</li>" +
        "</ul>" +
        "<p><strong>Interpretation:</strong> During the policy period, deaths were estimated to be " +
        Math.abs(immediatePolicyPercentChange).toFixed(2) + "% " + levelInterpretation +
        " at the start of the policy period, while the monthly trend " +
        trendInterpretation + " by " + Math.abs(policyMonthlyPercentTrendChange).toFixed(2) +
        " percentage points relative to the baseline trend. This shows association, not proof of causation.</p>";

    Plotly.newPlot("policy_percent_chart", [
        {
            x: modelDates,
            y: observedPercentDifference,
            mode: "lines+markers",
            name: "Observed difference from expected",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 },
            hovertemplate: "%{x|%b %Y}<br>Observed: %{y:.1f}%<extra></extra>"
        },
        {
            x: modelDates,
            y: modelPercentDifference,
            mode: "lines",
            name: "Model-estimated policy effect",
            line: { color: "#dc2626", width: 3 },
            hovertemplate: "%{x|%b %Y}<br>Model effect: %{y:.1f}%<extra></extra>"
        }
    ], {
        title: {
            text: "Estimated Policy Effect as Percent Difference from Expected Deaths",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: { color: "#222" },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: { text: "Date", font: { size: 16, color: "#222" } },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: { text: "Percent Difference from Expected Deaths", font: { size: 16, color: "#222" } },
            ticksuffix: "%",
            zeroline: true,
            zerolinecolor: "#111827",
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });
});
</script>


<div id="policy_regression_results_2" style="margin: 1.5rem 0; padding: 1rem; border: 1px solid #ddd; background: #fafafa;"></div>
<div id="policy_percent_chart_2" style="width:100%;height:650px;"></div>

<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        return;
    }

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const validData = x.map(function (date, i) {
        return {
            date: date,
            deaths: y[i]
        };
    }).filter(function (row) {
        return row.deaths > 0;
    });

    const modelDates = validData.map(function (row) {
        return row.date;
    });

    const observedDeaths = validData.map(function (row) {
        return row.deaths;
    });

    const logDeaths = observedDeaths.map(function (value) {
        return Math.log(value);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);
    const mainLagMonths = 6;

    function addMonths(date, months) {
        return new Date(date.getFullYear(), date.getMonth() + months, 1);
    }

    function transpose(matrix) {
        return matrix[0].map(function (_, columnIndex) {
            return matrix.map(function (row) {
                return row[columnIndex];
            });
        });
    }

    function multiplyMatrices(a, b) {
        return a.map(function (row) {
            return b[0].map(function (_, columnIndex) {
                return row.reduce(function (sum, value, i) {
                    return sum + value * b[i][columnIndex];
                }, 0);
            });
        });
    }

    function invertMatrix(matrix) {
        const n = matrix.length;
        const augmented = matrix.map(function (row, i) {
            return row.concat(
                Array.from({ length: n }, function (_, j) {
                    return i === j ? 1 : 0;
                })
            );
        });

        for (let i = 0; i < n; i++) {
            let pivot = augmented[i][i];

            if (Math.abs(pivot) < 1e-12) {
                for (let r = i + 1; r < n; r++) {
                    if (Math.abs(augmented[r][i]) > Math.abs(pivot)) {
                        const temp = augmented[i];
                        augmented[i] = augmented[r];
                        augmented[r] = temp;
                        pivot = augmented[i][i];
                        break;
                    }
                }
            }

            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] = augmented[i][j] / pivot;
            }

            for (let r = 0; r < n; r++) {
                if (r !== i) {
                    const factor = augmented[r][i];

                    for (let c = 0; c < 2 * n; c++) {
                        augmented[r][c] = augmented[r][c] - factor * augmented[i][c];
                    }
                }
            }
        }

        return augmented.map(function (row) {
            return row.slice(n);
        });
    }

    function linearRegression(designMatrix, response) {
        const yMatrix = response.map(function (value) {
            return [value];
        });

        const xTranspose = transpose(designMatrix);
        const xtx = multiplyMatrices(xTranspose, designMatrix);
        const xtxInverse = invertMatrix(xtx);
        const xty = multiplyMatrices(xTranspose, yMatrix);
        const coefficients = multiplyMatrices(xtxInverse, xty);

        return coefficients.map(function (row) {
            return row[0];
        });
    }

    function runPolicyModel(lagMonths) {
        const effectStart = addMonths(policyStart, lagMonths);

        const effectStartIndex = modelDates.findIndex(function (date) {
            return date >= effectStart;
        });

        const regressionRows = modelDates.map(function (date, i) {
            const inEffectPeriod = date >= effectStart && date < policyEnd;
            const effectTime = inEffectPeriod ? i - effectStartIndex : 0;

            return {
                date: date,
                time: i,
                policyEffect: inEffectPeriod ? 1 : 0,
                policyEffectTime: effectTime
            };
        });

        const designMatrix = regressionRows.map(function (row) {
            return [
                1,
                row.time,
                row.policyEffect,
                row.policyEffectTime
            ];
        });

        const coefficients = linearRegression(designMatrix, logDeaths);

        const intercept = coefficients[0];
        const baselineTrend = coefficients[1];
        const policyLevelChange = coefficients[2];
        const policyTrendChange = coefficients[3];

        const fittedLogDeaths = regressionRows.map(function (row) {
            return (
                intercept +
                baselineTrend * row.time +
                policyLevelChange * row.policyEffect +
                policyTrendChange * row.policyEffectTime
            );
        });

        const counterfactualLogDeaths = regressionRows.map(function (row) {
            return intercept + baselineTrend * row.time;
        });

        const fittedDeaths = fittedLogDeaths.map(function (value) {
            return Math.exp(value);
        });

        const counterfactualDeaths = counterfactualLogDeaths.map(function (value) {
            return Math.exp(value);
        });

        const observedPercentDifference = regressionRows.map(function (row, i) {
            if (row.date < effectStart || row.date >= policyEnd) {
                return null;
            }

            return ((observedDeaths[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
        });

        const modelPercentDifference = regressionRows.map(function (row, i) {
            if (row.date < effectStart || row.date >= policyEnd) {
                return null;
            }

            return ((fittedDeaths[i] - counterfactualDeaths[i]) / counterfactualDeaths[i]) * 100;
        });

        const modelValues = modelPercentDifference.filter(function (value) {
            return value !== null;
        });

        const averageModelPercentDifference =
            modelValues.reduce(function (total, value) {
                return total + value;
            }, 0) / modelValues.length;

        return {
            lagMonths: lagMonths,
            effectStart: effectStart,
            coefficients: coefficients,
            baselineMonthlyPercentTrend: (Math.exp(baselineTrend) - 1) * 100,
            immediatePolicyPercentChange: (Math.exp(policyLevelChange) - 1) * 100,
            policyMonthlyPercentTrendChange: (Math.exp(policyTrendChange) - 1) * 100,
            policyMonthlyPercentTrend: (Math.exp(baselineTrend + policyTrendChange) - 1) * 100,
            averageModelPercentDifference: averageModelPercentDifference,
            observedPercentDifference: observedPercentDifference,
            modelPercentDifference: modelPercentDifference
        };
    }

    const model0 = runPolicyModel(0);
    const model3 = runPolicyModel(3);
    const model6 = runPolicyModel(6);
    const mainModel = model6;

    document.getElementById("policy_regression_results").innerHTML =
        "<h3>Interrupted Time-Series Regression with Delayed Policy Effect</h3>" +
        "<p><strong>Model:</strong> log(Deaths) = β0 + β1 Time + β2 PolicyEffect + β3 PolicyEffectTime</p>" +
        "<p>The main model assumes the measurable policy effect begins <strong>6 months after January 2023</strong>, starting in <strong>" +
        mainModel.effectStart.toLocaleDateString("en-US", { month: "long", year: "numeric" }) +
        "</strong>. The shaded policy window still runs from January 2023 to January 2026.</p>" +
        "<ul>" +
        "<li><strong>Constant β0:</strong> " + mainModel.coefficients[0].toFixed(3) + "</li>" +
        "<li><strong>Baseline monthly trend β1:</strong> " + mainModel.baselineMonthlyPercentTrend.toFixed(2) + "% per month</li>" +
        "<li><strong>Immediate delayed-effect change β2:</strong> " + mainModel.immediatePolicyPercentChange.toFixed(2) + "%</li>" +
        "<li><strong>Delayed policy trend change β3:</strong> " + mainModel.policyMonthlyPercentTrendChange.toFixed(2) + "% per month</li>" +
        "<li><strong>Total monthly trend during delayed-effect period:</strong> " + mainModel.policyMonthlyPercentTrend.toFixed(2) + "% per month</li>" +
        "<li><strong>Average model-estimated effect during delayed-effect period:</strong> " + mainModel.averageModelPercentDifference.toFixed(2) + "%</li>" +
        "</ul>" +
        "<h4>Sensitivity check</h4>" +
        "<p>Estimated average policy effect under different assumed delays:</p>" +
        "<ul>" +
        "<li><strong>0-month lag:</strong> " + model0.averageModelPercentDifference.toFixed(2) + "%</li>" +
        "<li><strong>3-month lag:</strong> " + model3.averageModelPercentDifference.toFixed(2) + "%</li>" +
        "<li><strong>6-month lag:</strong> " + model6.averageModelPercentDifference.toFixed(2) + "%</li>" +
        "</ul>" +
        "<p>If the sign and size are similar across 0, 3, and 6 months, the result is more stable. If they change a lot, the conclusion depends strongly on the assumed delay. This shows association, not proof of causation.</p>";

    Plotly.newPlot("policy_percent_chart", [
        {
            x: modelDates,
            y: mainModel.observedPercentDifference,
            mode: "lines+markers",
            name: "Observed difference from expected",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 },
            hovertemplate: "%{x|%b %Y}<br>Observed: %{y:.1f}%<extra></extra>"
        },
        {
            x: modelDates,
            y: mainModel.modelPercentDifference,
            mode: "lines",
            name: "Model-estimated effect, 6-month lag",
            line: { color: "#dc2626", width: 3 },
            hovertemplate: "%{x|%b %Y}<br>Model effect: %{y:.1f}%<extra></extra>"
        }
    ], {
        title: {
            text: "Estimated Policy Effect with 6-Month Delayed Start",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: { color: "#222" },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: { text: "Date", font: { size: 16, color: "#222" } },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: { text: "Percent Difference from Expected Deaths", font: { size: 16, color: "#222" } },
            ticksuffix: "%",
            zeroline: true,
            zerolinecolor: "#111827",
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: mainModel.effectStart,
                x1: mainModel.effectStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "#dc2626", width: 2, dash: "dot" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: mainModel.effectStart,
                y: 0.92,
                xref: "x",
                yref: "paper",
                text: "6-Month Effect Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "#dc2626" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });
});
</script>
