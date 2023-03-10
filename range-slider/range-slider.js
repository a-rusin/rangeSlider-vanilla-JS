class RangeSlider {
    constructor(selector, options) {
        this.selector = document.querySelector(selector);

        this.options = {
            ...options,
            minSelectedDate: this.#inputDataParsing(options.minSelectedDate),
            maxSelectedDate: this.#inputDataParsing(options.maxSelectedDate),
        };

        this.switchMode = "years";

        this.minDateForMonth = this.options.minSelectedDate;
        this.maxDateForMonth = this.options.maxSelectedDate;

        this.render(this.switchMode);
    }

    #month = ["фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    #monthsFormatValues = {
        0: "Январь",
        0.08: "Февраль",
        0.17: "Март",
        0.25: "Апрель",
        0.33: "Май",
        0.42: "Июнь",
        0.5: "Июль",
        0.58: "Август",
        0.67: "Сентябрь",
        0.75: "Октябрь",
        0.83: "Ноябрь",
        0.92: "Декабрь",
    };

    #activeClassSwitcher = "active";
    #rotateClass = "rotate";

    #stepForSlider = 1 / 12; //12 - number of months in a year; 1 - basic step for range input

    #uncertaintyTranformX = 20; // calc experimentally
    #startedCompensation = 40; // calc experimentally

    #inputDataParsing(selectedDate) {
        return +selectedDate.split("-")[1] + (1 / 12) * +selectedDate.split("-")[0];
    }

    #getDOMElements() {
        this.progressElem = this.selector.querySelector(".rangeSlider-progress");
        this.rangeInputs = this.selector.querySelectorAll(".rangeSlider-inputs input");
        this.tooltips = this.selector.querySelectorAll(".rangeSlider-tooltip");
        this.switchers = this.selector.querySelectorAll("[data-switchers]");
    }

    #addEventsListenersRangeInputs() {
        this.rangeInputs.forEach((input) => {
            //change inputs
            input.addEventListener("input", (e) => {
                const currentDifMaxMinYear = +this.rangeInputs[1].value - +this.rangeInputs[0].value;
                if (currentDifMaxMinYear <= 1 && this.switchMode === "years") {
                    this.rangeInputs[0].value = +this.rangeInputs[1].value - 1; // gap - 1 year
                } else if (currentDifMaxMinYear <= this.#stepForSlider && this.switchMode === "month") {
                    this.rangeInputs[0].value = +this.rangeInputs[1].value - this.#stepForSlider; // gap - 1 month
                }
                this.changeProgress(); // on change
            });
        });
    }

    #addEventsListenerSwitchers() {
        this.switchers.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.switchers.forEach((btn) => btn.classList.remove(this.#activeClassSwitcher)); //delete active class
                e.target.classList.add(this.#activeClassSwitcher); //add active class
                this.switchMode = e.target.getAttribute("data-switchers"); //changemode
                this.minDateForMonth = +this.rangeInputs[0].value;
                this.maxDateForMonth = +this.rangeInputs[1].value;
                this.render(this.switchMode);
            });
        });
    }

    render(mode) {
        this.selector.innerHTML = "";

        let htmlRuler = "";

        if (mode === "years") {
            const currentDifMaxMinYear = this.options.maxDate - this.options.minDate;
            let step = 100 / currentDifMaxMinYear;
            for (let i = 0; i <= currentDifMaxMinYear; i++) {
                htmlRuler += `<li class="rangeSlider-years-item ${this.getRotateClass(currentDifMaxMinYear, 20)}" style="left: ${i * step}%; transform: translateX(-${i * step}%)">${this.options.minDate + i}</li>`;
            }
        } else if (mode === "month") {
            const currentDifMaxMinYear = Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth);
            let step = 100 / currentDifMaxMinYear;
            for (let i = 0; i <= currentDifMaxMinYear; i++) {
                let htmlSubRuler = "";

                this.#month.forEach((month, j) => {
                    let monthPos = i * step + (j + 1) * (100 / currentDifMaxMinYear / 12);
                    htmlSubRuler += `<li class="rangeSlider-years-item ${this.getRotateClass(currentDifMaxMinYear, 3)}" style="left: ${monthPos}%; transform: translateX(-${monthPos}%) ">${month}</li>`;
                });

                htmlRuler += `
                    <li class="rangeSlider-years-item rangeSlider-years-item-black ${this.getRotateClass(currentDifMaxMinYear, 3)}" style="left: ${i * step}%; transform: translateX(-${i * step}%)">${parseInt(this.minDateForMonth) + i}</li>
                    ${i + parseInt(this.minDateForMonth) === Math.ceil(this.maxDateForMonth) ? "" : htmlSubRuler}
                `;
            }
        }

        this.selector.insertAdjacentHTML("afterbegin", this.getTemplate(htmlRuler));
        this.init();
    }

    init() {
        this.#getDOMElements();
        this.changeProgress(this.minDateForMonth, this.maxDateForMonth); // on start
        this.#addEventsListenersRangeInputs();
        this.#addEventsListenerSwitchers();
    }

    changeProgress(min = +this.rangeInputs[0].value, max = +this.rangeInputs[1].value) {
        let left;
        let right;

        let step;
        let compensetionLeft;
        let compensetionRight;

        if (this.switchMode === "years") {
            const currentDifMaxMinYear = this.options.maxDate - this.options.minDate;
            left = 100 - (100 * (this.options.maxDate - min)) / currentDifMaxMinYear;
            right = (100 * (this.options.maxDate - max)) / currentDifMaxMinYear;

            step = this.#uncertaintyTranformX / currentDifMaxMinYear;
            compensetionLeft = this.#startedCompensation + step * (min - this.options.minDate);
            compensetionRight = this.#startedCompensation + step * (this.options.maxDate - max);
        } else if (this.switchMode === "month") {
            const currentDifMaxMinYear = Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth);
            left = 100 - (100 * (Math.ceil(this.maxDateForMonth) - min)) / currentDifMaxMinYear;
            right = (100 * (Math.ceil(this.maxDateForMonth) - max)) / currentDifMaxMinYear;

            step = this.#uncertaintyTranformX / currentDifMaxMinYear;
            compensetionLeft = this.#startedCompensation + step * (min - parseInt(this.minDateForMonth));
            compensetionRight = this.#startedCompensation + step * (Math.ceil(this.maxDateForMonth) - max);
        }

        this.changeElemsStyles(this.tooltips[0], "left", left, -compensetionLeft, min);
        this.changeElemsStyles(this.tooltips[1], "right", right, compensetionRight, max);
    }

    changeElemsStyles(tooltip, direction, postion, compensetion, value) {
        this.progressElem.style[direction] = postion + "%";
        tooltip.style[direction] = postion + "%";
        tooltip.style[direction] = postion + "%";
        tooltip.style.transform = `translateX(${compensetion}%)`;
        tooltip.innerHTML = `${this.#monthsFormatValues[+(value % 1).toFixed(2)]} <br /> ${parseInt(value)} `;
    }

    getActiveClass = (mode) => {
        return `${this.switchMode === mode ? this.#activeClassSwitcher : ""}`;
    };

    getRotateClass = (difYears, value) => {
        return `${difYears >= value ? this.#rotateClass : ""}`;
    };

    getMinMaxValueRangeInputs(value) {
        if (value === "min") {
            return this.switchMode === "years" ? this.options.minDate : parseInt(this.minDateForMonth);
        } else if (value === "max") {
            return this.switchMode === "years" ? this.options.maxDate : Math.ceil(this.maxDateForMonth);
        }
    }

    getTemplate(htmlLayout) {
        return `
            <div class="rangeSlider-container">
                <div class="rangeSlider-switcher">
                    <button data-switchers="years" class="rangeSlider-btn ${this.getActiveClass("years")}">Все года</button>
                    <button data-switchers="month" class="rangeSlider-btn ${this.getActiveClass("month")}">Месяца</button>
                </div>
                <div class="rangeSlider-content">
                    <div class="rangeSlider-slider">
                        <div class="rangeSlider-progress"></div>
                    </div>
                    <div class="rangeSlider-inputs">
                        <div class="rangeSlider-tooltip rangeSlider-tooltip-min">Месяц <br />Год</div>
                        <div class="rangeSlider-tooltip rangeSlider-tooltip-max">Месяц <br />Год</div>
                        <input
                            type="range"
                            name="rangeSlider-input-min"
                            class="rangeSlider-input-min"
                            min="${this.getMinMaxValueRangeInputs("min")}"
                            max="${this.getMinMaxValueRangeInputs("max")}"
                            value="${this.minDateForMonth}"
                            step=${this.#stepForSlider}
                        >
                        <input
                            type="range"
                            name="rangeSlider-input-max"
                            class="rangeSlider-input-max"
                            min="${this.getMinMaxValueRangeInputs("min")}"
                            max="${this.getMinMaxValueRangeInputs("max")}"
                            value="${this.maxDateForMonth}"
                            step=${this.#stepForSlider}
                        >

                        <div class="selector">
                        </div>
                        
                    </div>
                    <ul class="rangeSlider-years-list">
                            ${htmlLayout}
                    </ul>
                </div>
            </div>
        `;
    }
}
