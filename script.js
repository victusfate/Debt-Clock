(function() {
    var clock = new DebtClock("DebtClockSpan", "PerCitizenSpan", "PerHouseHoldSpan", 30);
})();


/**
 * Copyright (c) 2010, Carl Mowday
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 
 *   * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the 
 *             documentation and/or other materials provided with the distribution.
 *   * Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this 
 *             software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS 
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */

function DebtClock(totalDebt, perCitizen, perHousehold, fps) {
    this.TOTAL_DEBT = totalDebt;
    this.PER_CITIZEN = perCitizen;
    this.PER_HOUSEHOLD = perHousehold;
    this.DELAY = fps ? 1000 / fps : 100;
    // How many decimals to use in total
    this.TOTAL_DECIMALS = 0;
    // How many decimals to use in per citizen
    this.CITIZEN_DECIMALS = 3;
    // How many decimals to use in per household
    this.HOUSEHOLD_DECIMALS = 3;
    // The date the data was taken
    this.START_DATE = new Date(2010,7,12);
    // What value to start from (http://www.treasurydirect.gov/NP/BPDLogin?application=np)
    this.START_DEBT = 13319830936991.03;
    // Dollars per day (calculated by getting all the values from http://www.treasurydirect.gov/NP/BPDLogin?application=np
    // this year and then calculating the average increase a day)
    this.DEBT_PER_DAY = 6690707097.47;
    // The amount of citizens in USA
    this.CITIZENS = 306000000;
    // The amount of people in the average household
    this.HOUSEHOLDS = 114825428;
    //Calculates how much the debt increases each day
    this.debtPerSecond = this.DEBT_PER_DAY / 24 / 60 / 60;
    //Adds commas to the string
    this.addCommas = function(str, nrOfDecimals) {
        str = String(str);
        var decimals = str.split(".")[1];
        decimals = decimals ? "." + decimals : "";
        decimals = decimals.substring(0, nrOfDecimals + 1);
        str = str.split(".")[0];
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(str)) {
            str = str.replace(rgx, '$1' + ',' + '$2');
        }
        if (nrOfDecimals > 0) {
            return str + decimals;
        } else {
            return str;
        }
    };
    //Updates the target id's innerHTML
    this.updateOutput = function(id, value) {
        var output = document.getElementById(id);
        if (output != undefined) {
            output.innerHTML = value;
        }
    };
    //Updates the clock (will call itself)
    this.update = function() {
        var now = new Date();
        var difference = now - this.START_DATE;
        difference /= 1000;
        var total = String(this.START_DEBT + (difference * this.debtPerSecond));
        var perCitizen = String(total / this.CITIZENS);
        var perHousehold = String(total / this.HOUSEHOLDS);
        var str;
        str = this.addCommas(total, this.TOTAL_DECIMALS);
        this.updateOutput(this.TOTAL_DEBT, str);
        str = this.addCommas(perHousehold, this.HOUSEHOLD_DECIMALS);
        this.updateOutput(this.PER_HOUSEHOLD, str);
        str = this.addCommas(perCitizen, this.CITIZEN_DECIMALS);
        this.updateOutput(this.PER_CITIZEN, str);
        thisObj = this;
        window.setTimeout(function() {
            thisObj.update();
        }, this.DELAY);
    };
    this.update();
}