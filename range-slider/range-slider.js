class RangeSlider {
    constructor(selector, options) {
        this.selector = document.querySelector(selector);

        this.options = {
            ...options,
            minSelectedDate:
                +options.minSelectedDate.split("-")[1] +
                (1 / 12) * options.minSelectedDate.split("-")[0],
            maxSelectedDate:
                +options.maxSelectedDate.split("-")[1] +
                (1 / 12) * options.maxSelectedDate.split("-")[0],
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

    render(mode) {
        this.selector.innerHTML = "";

        let htmlRuler = "";

        if (mode === "years") {
            for (let i = 0; i <= this.options.maxDate - this.options.minDate; i++) {
                htmlRuler += `<li class="rangeSlider-years-item" style="left: ${
                    i * (100 / (this.options.maxDate - this.options.minDate))
                }%">${this.options.minDate + i}</li>`;
            }
        } else if (mode === "month") {
            for (
                let i = 0;
                i <= Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth);
                i++
            ) {
                let step = Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth);
                let positionLeft = i * (100 / step);
                let htmlSubRuler = "";
                this.#month.forEach((month, j) => {
                    htmlSubRuler += `<li class="rangeSlider-years-item" style="left: ${
                        positionLeft + (j + 1) * (((i + 1) * (100 / step) - positionLeft) / 12)
                    }%">${month}</li>`;
                });
                htmlRuler += `
                    <li class="rangeSlider-years-item rangeSlider-years-item-black" style="left: ${positionLeft}%">${
                    parseInt(this.minDateForMonth) + i
                }</li>
                    ${
                        i + parseInt(this.minDateForMonth) === Math.ceil(this.maxDateForMonth)
                            ? ""
                            : htmlSubRuler
                    }
                `;
            }
        }

        // render main html
        const htmlMain = `
            <div class="rangeSlider-container">
                <div class="rangeSlider-switcher">
                    <a href="#" data-switchers="years" class="rangeSldier-link ${
                        this.switchMode === "years" ? "active" : " "
                    }">Все года</a>
                    <a href="#" data-switchers="month" class="rangeSldier-link ${
                        this.switchMode === "month" ? "active" : " "
                    }">Месяца</a>
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
                            min="${
                                this.switchMode === "years"
                                    ? this.options.minDate
                                    : parseInt(this.minDateForMonth)
                            }"
                            max="${
                                this.switchMode === "years"
                                    ? this.options.maxDate
                                    : Math.ceil(this.maxDateForMonth)
                            }"
                            value="${this.minDateForMonth}"
                            step="0.0833333333333333"
                        >
                        <input
                            type="range"
                            name="rangeSlider-input-max"
                            class="rangeSlider-input-max"
                            min="${
                                this.switchMode === "years"
                                    ? this.options.minDate
                                    : parseInt(this.minDateForMonth)
                            }"
                            max="${
                                this.switchMode === "years"
                                    ? this.options.maxDate
                                    : Math.ceil(this.maxDateForMonth)
                            }"
                            value="${this.maxDateForMonth}"
                            step="0.0833333333333333"
                        >

                        <div class="selector">
                        </div>
                        
                    </div>
                    <ul class="rangeSlider-years-list">
                            ${htmlRuler}
                    </ul>
                </div>
            </div>
        `;
        this.selector.insertAdjacentHTML("afterbegin", htmlMain);
        this.init();
    }

    init() {
        this.progressElem = this.selector.querySelector(".rangeSlider-progress");
        this.rangeInputs = this.selector.querySelectorAll(".rangeSlider-inputs input");
        this.tooltips = this.selector.querySelectorAll(".rangeSlider-tooltip");
        this.switchers = this.selector.querySelectorAll("[data-switchers]");

        this.changeProgress(this.minDateForMonth, this.maxDateForMonth); // on start

        this.rangeInputs.forEach((input) => {
            //change inputs
            input.addEventListener("input", (e) => {
                if (
                    +this.rangeInputs[1].value - +this.rangeInputs[0].value <= 1 &&
                    this.switchMode === "years"
                ) {
                    this.rangeInputs[0].value = +this.rangeInputs[1].value - 1; // gap - 1 year
                } else if (
                    +this.rangeInputs[1].value - +this.rangeInputs[0].value <= 0.0833333333333333 &&
                    this.switchMode === "month"
                ) {
                    this.rangeInputs[0].value = +this.rangeInputs[1].value - 0.0833333333333333; // gap - 1 month
                }
                this.changeProgress(); // on change
            });
        });

        this.switchers.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.switchers.forEach((btn) => btn.classList.remove("active")); //delete active class
                e.target.classList.add("active"); //add active class
                this.switchMode = e.target.getAttribute("data-switchers"); //changemode
                this.minDateForMonth = +this.rangeInputs[0].value;
                this.maxDateForMonth = +this.rangeInputs[1].value;
                this.render(this.switchMode);
            });
        });
    }

    changeProgress(min = +this.rangeInputs[0].value, max = +this.rangeInputs[1].value) {
        let left;
        let right;

        let step;
        let compensetionLeft;
        let compensetionRight;

        if (this.switchMode === "years") {
            left =
                100 -
                (100 * (this.options.maxDate - min)) /
                    (this.options.maxDate - this.options.minDate);
            right =
                (100 * (this.options.maxDate - max)) /
                (this.options.maxDate - this.options.minDate);

            step = 20 / (this.options.maxDate - this.options.minDate);
            compensetionLeft = 40 + step * (min - this.options.minDate);
            compensetionRight = 40 + step * (this.options.maxDate - max);
        } else if (this.switchMode === "month") {
            left =
                100 -
                (100 * (Math.ceil(this.maxDateForMonth) - min)) /
                    (Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth));
            right =
                (100 * (Math.ceil(this.maxDateForMonth) - max)) /
                (Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth));

            step = 20 / (Math.ceil(this.maxDateForMonth) - parseInt(this.minDateForMonth));
            compensetionLeft = 40 + step * (min - parseInt(this.minDateForMonth));
            compensetionRight = 40 + step * (Math.ceil(this.maxDateForMonth) - max);
        }

        // let someTestValueLeft = 0;

        this.progressElem.style.left = left + "%";
        this.progressElem.style.right = right + "%";

        this.tooltips[0].style.left = left + "%";
        this.tooltips[0].style.transform = `translateX(-${compensetionLeft}%)`;
        this.tooltips[0].innerHTML = `${
            this.#monthsFormatValues[+(min % 1).toFixed(2)]
        } <br /> ${parseInt(min)} `;

        this.tooltips[1].style.right = right + "%";
        this.tooltips[1].style.transform = `translateX(${compensetionRight}%)`;
        this.tooltips[1].innerHTML = `${
            this.#monthsFormatValues[+(max % 1).toFixed(2)]
        } <br /> ${parseInt(max)} `;
    }
}
