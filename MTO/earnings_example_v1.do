*Gregory Bruich, Ph.D.
*Send corrections and suggestions to gbruich@fas.harvard.edu

*Simulates bias in observational comparisons due to confounding (race)
*Then compares with estimate from randomized experiment

clear all
set seed 2110

*Set sample size - 500 to match the sepsis interactive
local obs 500

set obs `obs'

*PART 1: Observational comparisons confounded by differences in racial composition

*Half in MLK and half in Wakefield
gen wakefield = 0
replace wakefield = 1 if _n >  `obs'/2

*Set fraction Black to be 75% in MLK and 25% in Wakefield

*MLK 25% white and 75% Black
gen black = (runiform() < 0.75) if wakefield == 0

*Wakefield 55% White and 45% Black
replace black = (runiform() < 0.45) if wakefield == 1

*Check racial composition
bys wakefield: sum black

*Income in 1000s
gen y0 = 35 - 20*black + rnormal()

*Treatment effect = $2000
gen y1 = y0 + 2

*Observed outcome
gen y_obs = y0 + wakefield*(y1 - y0)

bys wakefield: sum y0 y1 y_obs

*Repeat for bachelor’s degree or higher at age 25 instead of earnings
*Non-hispanic White: 40.1%
*Black or African American: 26.1%
gen c0 = (0.261 > runiform() ) if black == 1
replace c0 = (0.401 > runiform() ) if black == 0

*MTO found a 5.2 percentage point increase in college attendance
gen c1 = c0
replace c1 = 1 if 0.052 > runiform() & black == 0 & c0 == 0
replace c1 = 1 if 0.052 > runiform() & black == 1 & c0 == 0

*Observed outcome
gen c_obs = c0 if wakefield == 0
replace c_obs = c1 if wakefield == 1

bys wakefield: sum c0 c1 c_obs

bys black: sum c0 c1 c_obs

*Estimate difference in means using observational data
regress y_obs wakefield, r

regress c_obs wakefield, r

*Demonstrate difference in racial composition
regress black wakefield, r

*Label variables
label var black "Race is Black"
label var wakefield "Actual Neighborhood is Wakefield"
label var y0 "Potential Earnings if not in Wakefield"
label var y1 "Potential Earnings if in Wakefield"
label var c0 "Potential College if not in Wakefield"
label var c1 "Potential College if in Wakefield"
label var y_obs "Observed earnings based on actual location"
label var c_obs "Observed college based on actual location"

*Export data
export excel using "simulated_data_v1.xls", firstrow(varlabels) replace

*PART 2: Experimental comparisons are unbiased

*Now contrast with randomization
gen treated = (runiform() < 0.5)

*Define earnings as y0 if untreated, and y1 as treated
gen y_experiment = y0 + treated*(y1 - y0)

*Define college as c0 if untreated, and c1 if treated
gen c_experiment = c0 if treated == 0
replace c_experiment = c1 if treated == 1

*Estimate difference in mean earnings
regress y_experiment treated, r

*Estimate difference in fraction college
regress c_experiment treated, r

*Demonstrate balance of racial composition
regress black treated, r

*Label variables
label var treated "Randomly assigned location"
label var y_experiment "Realized earnings in experiment"
label var c_experiment "Realized college in experiment"

*Export data
sort wakefield
export excel using "simulated_data_names_v1.xls", firstrow(variables)  replace

export excel using "simulated_data_v1.xls", firstrow(varlabels) replace

*PART 3: Produce summary statistics and graphs

*Collapse data for observational data 
preserve
collapse (mean) y_obs c_obs black, by(wakefield)

* create labels for bar chart
gen lab_y = "{bf:" + string(y_obs, "%2.1fc") + "}" 
replace lab_y = "{bf:" + "$ " + lab_y + "K"  +  "}" 

*Compare earnings
#delimit ;
twoway 
(bar y_obs wakefield if wakefield == 0, barwidth(0.4) color(gs12)) 
(bar y_obs wakefield if wakefield == 1, barwidth(0.4) color("102 220 206"))
(scatter y_obs wakefield, 
		mlabel(lab_y) mcolor(none) mlabs(*1.2) mlabcolor(black) mlabpos(12))
 , legend(off) 
xlab(0 "MLK Jr. Towers" 1 "Wakefield") 
xtitle("") 
ytitle("Earnings ($1000s)" " ") 
graphregion(color(white)) bgcolor(white)
xsc(range(-0.3 1.3)) ylab(0(10)30,nogrid)
title(" ", size(vhuge));
#delimit cr

graph export simulation_v1.png, replace
graph export simulation_v1.wmf, replace

*Compare Race
replace black = 100*black
gen lab_black = "{bf:" + string(black, "%3.1fc") + "}" 
replace lab_black = "{bf:" + lab_black + "%" + "}" 

#delimit ;
twoway 
(bar black wakefield if wakefield == 0, barwidth(0.4) color(gs12)) 
(bar black wakefield if wakefield == 1, barwidth(0.4) color("102 220 206"))
(scatter black wakefield, 
		mlabel(lab_black) mcolor(none) mlabs(*1.2) mlabcolor(black) mlabpos(12))
 , legend(off) 
xlab(0 "MLK Jr. Towers" 1 "Wakefield") 
xtitle("") 
ytitle("Black (%)" " ") 
graphregion(color(white)) bgcolor(white)
xsc(range(-0.3 1.3)) ylab(0(25)80,nogrid)
title(" ", size(vhuge));
#delimit cr

graph export simulation_race_v1.png, replace
graph export simulation_race_v1.wmf, replace
restore


*Collapse data for experimental comparison
preserve
collapse (mean) y_experiment c_experiment black, by(treated)

* create labels for bar chart 
gen lab_y = "{bf:" + string(y_experiment, "%3.1fc") + "}" 
replace lab_y = "{bf:" + "$ " + lab_y + "K"  +  "}" 

*Compare earnings
#delimit ;
twoway 
(bar y_experiment treated if treated == 0, barwidth(0.4) color(gs12)) 
(bar y_experiment treated if treated == 1, barwidth(0.4) color("102 220 206"))
(scatter y_experiment treated, 
		mlabel(lab_y) mcolor(none) mlabs(*1.2) mlabcolor(black) mlabpos(12))
 , legend(off) 
xlab(0 "MLK Jr. Towers" 1 "Wakefield") 
xtitle("") 
ytitle("Earnings ($1000s)" " ") 
graphregion(color(white)) bgcolor(white)
xsc(range(-0.3 1.3)) ylab(0(10)30,nogrid)
title(" ", size(vhuge));
#delimit cr

graph export simulation2_v1.png, replace
graph export simulation2_v1.wmf, replace

*Compare Race
replace black = 100*black
gen lab_black = "{bf:" + string(black, "%3.1fc") + "}" 
replace lab_black = "{bf:" + lab_black + "%" + "}" 

#delimit ;
twoway 
(bar black treated if treated == 0, barwidth(0.4) color(gs12)) 
(bar black treated if treated== 1, barwidth(0.4) color("102 220 206"))
(scatter black treated, 
		mlabel(lab_black) mcolor(none) mlabs(*1.2) mlabcolor(black) mlabpos(12))
 , legend(off) 
xlab(0 "MLK Jr. Towers" 1 "Wakefield") 
xtitle("") 
ytitle("Black (%)" " ") 
graphregion(color(white)) bgcolor(white)
xsc(range(-0.3 1.3)) ylab(0(25)80,nogrid)
title(" ", size(vhuge));
#delimit cr

graph export simulation2_race_v1.png, replace
graph export simulation2_race_v1.wmf, replace
restore

