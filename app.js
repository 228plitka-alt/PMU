
/* ============================================================
   ГеоКалькулятор — логика мобильного приложения
   ============================================================ */

const FIGURES = {
  square: {
    name: "Квадрат",
    desc: "Все стороны равны",
    icon: '<rect x="4" y="4" width="16" height="16"/>',
    illustration: '<rect x="7" y="7" width="22" height="22"/>',
    fields: [
      { id: "a", label: "Сторона a", unit: "см" }
    ],
    calc: ({ a }) => ({
      perimeter: { label: "Периметр", value: 4 * a, unit: "см" },
      area: { label: "Площадь", value: a * a, unit: "см²" }
    })
  },

  rectangle: {
    name: "Прямоугольник",
    desc: "Противоположные стороны равны",
    icon: '<rect x="3" y="6" width="18" height="12"/>',
    illustration: '<rect x="5" y="9" width="26" height="18"/>',
    fields: [
      { id: "a", label: "Сторона a", unit: "см" },
      { id: "b", label: "Сторона b", unit: "см" }
    ],
    calc: ({ a, b }) => ({
      perimeter: { label: "Периметр", value: 2 * (a + b), unit: "см" },
      area: { label: "Площадь", value: a * b, unit: "см²" }
    })
  },

  triangle: {
    name: "Треугольник",
    desc: "По трём сторонам (формула Герона)",
    icon: '<path d="M12 4 L21 19 L3 19 Z"/>',
    illustration: '<path d="M18 6 L30 26 L6 26 Z"/>',
    fields: [
      { id: "a", label: "Сторона a", unit: "см" },
      { id: "b", label: "Сторона b", unit: "см" },
      { id: "c", label: "Сторона c", unit: "см" }
    ],
    calc: ({ a, b, c }) => {
      if (a + b <= c || a + c <= b || b + c <= a) {
        throw new Error(
          "Треугольник с такими сторонами не существует (нарушено неравенство треугольника)."
        );
      }

      const p = (a + b + c) / 2;
      const area = Math.sqrt(
        p * (p - a) * (p - b) * (p - c)
      );

      return {
        perimeter: {
          label: "Периметр",
          value: a + b + c,
          unit: "см"
        },
        area: {
          label: "Площадь",
          value: area,
          unit: "см²"
        }
      };
    }
  },

  parallelogram: {
    name: "Параллелограмм",
    desc: "Стороны и высота",
    icon: '<path d="M3 15 L9 5 L21 5 L15 15 Z"/>',
    illustration: '<path d="M4 22 L10 9 L30 9 L24 22 Z"/>',
    fields: [
      { id: "a", label: "Сторона a", unit: "см" },
      { id: "b", label: "Сторона b", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
    calc: ({ a, b, h }) => {
      if (h > b) {
        throw new Error(
          "Высота не может быть больше стороны, к которой она относится."
        );
      }

      return {
        perimeter: {
          label: "Периметр",
          value: 2 * (a + b),
          unit: "см"
        },
        area: {
          label: "Площадь",
          value: a * h,
          unit: "см²"
        }
      };
    }
  },

  trapezoid: {
    name: "Трапеция",
    desc: "Основания, стороны и высота",
    icon: '<path d="M4 17 L8 5 L16 5 L20 17 Z"/>',
    illustration: '<path d="M4 24 L9 8 L23 8 L28 24 Z"/>',
    fields: [
      { id: "a", label: "Основание a", unit: "см" },
      { id: "b", label: "Основание b", unit: "см" },
      { id: "c", label: "Сторона c", unit: "см" },
      { id: "d", label: "Сторона d", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
   calc: ({ a, b, c, d, h }) => {
  // Высота не может превышать боковые стороны
  if (h > c || h > d) {
    throw new Error(
      "Высота не может быть больше боковой стороны."
    );
  }

  // Горизонтальные проекции боковых сторон
  const x = Math.sqrt(c * c - h * h);
  const y = Math.sqrt(d * d - h * h);

  // Разность оснований
  const difference = Math.abs(a - b);

  // Допуск для погрешностей вычислений
  const tolerance = 1e-6 * Math.max(
    1, difference, x, y
  );

  // Проверка геометрической совместимости
  const possible =
    Math.abs(difference - (x + y)) <= tolerance ||
    Math.abs(difference - Math.abs(x - y)) <= tolerance;

  if (!possible) {
    throw new Error(
      "Трапеция с такими основаниями, боковыми сторонами и высотой не существует."
    );
  }

  return {
    perimeter: {
      label: "Периметр",
      value: a + b + c + d,
      unit: "см"
    },
        area: {
        label: "Площадь",
        value: ((a + b) / 2) * h,
        unit: "см²"
      }
    };
  }
},

rhombus: {
    name: "Ромб",
    desc: "Сторона и высота",
    icon: '<path d="M12 3 L20 12 L12 21 L4 12 Z"/>',
    illustration: '<path d="M16 4 L28 16 L16 28 L4 16 Z"/>',
    fields: [
      { id: "a", label: "Сторона a", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
    calc: ({ a, h }) => {
      if (h > a) {
        throw new Error(
          "Высота ромба не может быть больше его стороны."
        );
      }

      return {
        perimeter: {
          label: "Периметр",
          value: 4 * a,
          unit: "см"
        },
        area: {
          label: "Площадь",
          value: a * h,
          unit: "см²"
        }
      };
    }
  },

  ellipse: {
    name: "Эллипс",
    desc: "Полуоси a и b",
    icon: '<ellipse cx="12" cy="12" rx="8" ry="5"/>',
    illustration: '<ellipse cx="16" cy="16" rx="13" ry="8"/>',
    fields: [
      { id: "a", label: "Полуось a", unit: "см" },
      { id: "b", label: "Полуось b", unit: "см" }
    ],
    calc: ({ a, b }) => {
      const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);

      const perimeter =
        Math.PI * (a + b) *
        (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

      return {
        perimeter: {
          label: "Периметр (прибл.)",
          value: perimeter,
          unit: "см"
        },
        area: {
          label: "Площадь",
          value: Math.PI * a * b,
          unit: "см²"
        }
      };
    }
  },

  cube: {
    name: "Куб",
    desc: "Ребро a",
    icon: '<path d="M5 8 L12 5 L19 8 L19 17 L12 20 L5 17 Z M5 8 L12 11 L19 8 M12 11 L12 20"/>',
    illustration: '<path d="M6 11 L16 6 L26 11 L26 21 L16 26 L6 21 Z M6 11 L16 16 L26 11 M16 16 L16 26"/>',
    fields: [
      { id: "a", label: "Ребро a", unit: "см" }
    ],
    calc: ({ a }) => ({
      area: {
        label: "Площадь поверхности",
        value: 6 * a * a,
        unit: "см²"
      },
      volume: {
        label: "Объём",
        value: a * a * a,
        unit: "см³"
      }
    })
  },

  parallelepiped: {
    name: "Параллелепипед",
    desc: "Длина, ширина, высота",
    icon: '<path d="M3 8 L14 8 L14 20 L3 20 Z M3 8 L9 3 H20 L14 8 M14 8 L20 3 V15 L14 20"/>',
    illustration: '<path d="M3 12 L20 12 L20 29 L3 29 Z M3 12 L11 5 H28 L20 12 M20 12 L28 5 V22 L20 29"/>',
    fields: [
      { id: "a", label: "Длина a", unit: "см" },
      { id: "b", label: "Ширина b", unit: "см" },
      { id: "c", label: "Высота c", unit: "см" }
    ],
    calc: ({ a, b, c }) => ({
      area: {
        label: "Площадь поверхности",
        value: 2 * (a * b + a * c + b * c),
        unit: "см²"
      },
      volume: {
        label: "Объём",
        value: a * b * c,
        unit: "см³"
      }
    })
  },

  cone: {
    name: "Конус",
    desc: "Радиус и высота",
    icon: '<path d="M12 4 L20 19 A8 3 0 0 1 4 19 Z M4 19 A8 3 0 0 0 20 19"/>',
    illustration: '<path d="M16 5 L27 25 A11 4 0 0 1 5 25 Z M5 25 A11 4 0 0 0 27 25"/>',
    fields: [
      { id: "r", label: "Радиус r", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
    calc: ({ r, h }) => {
      const l = Math.sqrt(r * r + h * h);

      return {
        area: {
          label: "Площадь поверхности",
          value: Math.PI * r * (r + l),
          unit: "см²"
        },
        volume: {
          label: "Объём",
          value: (1 / 3) * Math.PI * r * r * h,
          unit: "см³"
        }
      };
    }
  },

  pyramid: {
    name: "Квадратная пирамида",
    desc: "В основании квадрат",
    icon: '<path d="M12 3 L21 19 L12 22 L3 19 Z M12 3 L12 22"/>',
    illustration: '<path d="M16 4 L28 25 L16 29 L4 25 Z M16 4 L16 29"/>',
    fields: [
      { id: "a", label: "Сторона основания a", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
    calc: ({ a, h }) => {
      const apothem = Math.sqrt(h * h + (a / 2) * (a / 2));
      const baseArea = a * a;
      const lateralArea = 2 * a * apothem;

      return {
        area: {
          label: "Площадь поверхности",
          value: baseArea + lateralArea,
          unit: "см²"
        },
        volume: {
          label: "Объём",
          value: (1 / 3) * baseArea * h,
          unit: "см³"
        }
      };
    }
  },

  cylinder: {
    name: "Цилиндр",
    desc: "Радиус и высота",
    icon: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6 L5 18 A7 3 0 0 0 19 18 L19 6"/>',
    illustration: '<ellipse cx="16" cy="8" rx="11" ry="4"/><path d="M5 8 L5 24 A11 4 0 0 0 27 24 L27 8"/>',
    fields: [
      { id: "r", label: "Радиус r", unit: "см" },
      { id: "h", label: "Высота h", unit: "см" }
    ],
    calc: ({ r, h }) => ({
      area: {
        label: "Площадь поверхности",
        value: 2 * Math.PI * r * (r + h),
        unit: "см²"
      },
      volume: {
        label: "Объём",
        value: Math.PI * r * r * h,
        unit: "см³"
      }
    })
  },

  sphere: {
    name: "Шар",
    desc: "Радиус r",
    icon: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="4"/>',
    illustration: '<circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="12" ry="5"/>',
    fields: [
      { id: "r", label: "Радиус r", unit: "см" }
    ],
    calc: ({ r }) => ({
      area: {
        label: "Площадь поверхности",
        value: 4 * Math.PI * r * r,
        unit: "см²"
      },
      volume: {
        label: "Объём",
        value: (4 / 3) * Math.PI * r * r * r,
        unit: "см³"
      }
    })
  }
};


/* ============================================================
   ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
   ============================================================ */

let currentFigure = "square";

const figuresGrid = document.getElementById("figuresGrid");
const cardTitle = document.getElementById("cardTitle");
const fieldsContainer = document.getElementById("fieldsContainer");
const calcBtn = document.getElementById("calcBtn");
const resultCard = document.getElementById("resultCard");
const errorMsg = document.getElementById("errorMsg");


/* ============================================================
   ОТОБРАЖЕНИЕ СПИСКА ФИГУР
   ============================================================ */

function renderFiguresGrid() {
  figuresGrid.innerHTML = "";

  Object.keys(FIGURES).forEach((key) => {
    const fig = FIGURES[key];

    const btn = document.createElement("button");

    btn.type = "button";
    btn.className =
      "figure-btn" + (key === currentFigure ? " active" : "");

    btn.dataset.figure = key;
    btn.setAttribute("aria-label", fig.name);
    btn.setAttribute("aria-pressed", key === currentFigure);

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        ${fig.icon}
      </svg>
      <span>${fig.name}</span>
    `;

    btn.addEventListener("click", () => selectFigure(key));

    figuresGrid.appendChild(btn);
  });
}


/* ============================================================
   ВЫБОР ФИГУРЫ
   ============================================================ */

function selectFigure(key) {
  if (!FIGURES[key]) return;

  currentFigure = key;

  document.querySelectorAll(".figure-btn").forEach((btn) => {
    const active = btn.dataset.figure === key;

    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active);
  });

  renderParams();
  hideResult();
  hideError();
}


/* ============================================================
   ОТОБРАЖЕНИЕ ПОЛЕЙ ВВОДА
   ============================================================ */

function renderParams() {
  const fig = FIGURES[currentFigure];

  cardTitle.innerHTML = `
    <div class="figure-illustration">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        ${fig.illustration}
      </svg>
    </div>

    <div>
      <div>${fig.name}</div>
      <div class="figure-desc">${fig.desc}</div>
    </div>
  `;

  fieldsContainer.innerHTML = "";

  fig.fields.forEach((field) => {
    const wrap = document.createElement("div");

    wrap.className = "field";

    wrap.innerHTML = `
      <label for="inp_${field.id}">
        ${field.label}
        <span class="badge">${field.unit}</span>
      </label>

      <div class="input-wrap">
        <input
          type="number"
          id="inp_${field.id}"
          inputmode="decimal"
          step="any"
          min="0"
          placeholder="Введите значение..."
          autocomplete="off"
        >

        <span class="unit">${field.unit}</span>
      </div>
    `;

    fieldsContainer.appendChild(wrap);

    const input = wrap.querySelector("input");

    input.addEventListener("input", () => {
      input.classList.remove("invalid");
      hideError();
      hideResult();
    });
  });
}


/* ============================================================
   УПРАВЛЕНИЕ РЕЗУЛЬТАТАМИ И ОШИБКАМИ
   ============================================================ */

function hideResult() {
  resultCard.classList.remove("show");
  resultCard.innerHTML = "";
}

function hideError() {
  errorMsg.classList.remove("show");
  errorMsg.textContent = "";
}

function showError(message) {
  errorMsg.innerHTML = `
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e74c3c"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v6M12 16v.5"/>
    </svg>

    <span>${message}</span>
  `;

  errorMsg.classList.add("show");
}


/* ============================================================
   ПРОВЕРКА ПОЛЕЙ ВВОДА
   ============================================================ */

function markInvalid(input) {
  input.classList.add("invalid", "error-shake");

  setTimeout(() => {
    input.classList.remove("error-shake");
  }, 400);
}


/* ============================================================
   РАСЧЁТ
   ============================================================ */

function calculate() {
  hideResult();
  hideError();

  const fig = FIGURES[currentFigure];
  const values = {};

  let hasError = false;

  fig.fields.forEach((field) => {
    const input = document.getElementById("inp_" + field.id);

    const raw = input.value.trim().replace(",", ".");

    if (raw === "") {
      markInvalid(input);

      if (!hasError) {
        showError(`Заполните поле «${field.label}».`);
      }

      hasError = true;
      return;
    }

    const num = Number(raw);

    if (!Number.isFinite(num)) {
      markInvalid(input);

      if (!hasError) {
        showError(
          `Поле «${field.label}» содержит некорректное значение.`
        );
      }

      hasError = true;
      return;
    }

    if (num <= 0) {
      markInvalid(input);

      if (!hasError) {
        showError(
          `Значение «${field.label}» должно быть больше нуля.`
        );
      }

      hasError = true;
      return;
    }

    values[field.id] = num;
  });

  if (hasError) return;

  let result;

  try {
    result = fig.calc(values);

    Object.values(result).forEach((item) => {
      if (!Number.isFinite(item.value)) {
        throw new Error(
          "Не удалось выполнить расчёт. Проверьте введённые значения."
        );
      }
    });

  } catch (error) {
    showError(error.message);
    return;
  }

  renderResult(result);
}


/* ============================================================
   ФОРМАТИРОВАНИЕ ЧИСЕЛ
   ============================================================ */

function formatNumber(number) {
  if (!Number.isFinite(number)) return "—";

  const rounded = Math.round(number * 10000) / 10000;

  return rounded.toLocaleString("ru-RU", {
    maximumFractionDigits: 4
  });
}


/* ============================================================
   ВЫВОД РЕЗУЛЬТАТА
   ============================================================ */

function renderResult(result) {
  const iconP = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12 L7 8 M3 12 L7 16 M3 12 L21 12"/>
    </svg>
  `;

  const iconA = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  `;

  const iconV = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 L21 8 L21 16 L12 21 L3 16 L3 8 Z
               M3 8 L12 13 L21 8 M12 13 L12 21"/>
    </svg>
  `;

  const iconFor = (key) => {
    if (key === "perimeter") return iconP;
    if (key === "area") return iconA;
    return iconV;
  };

  const rows = Object.keys(result).map((key) => {
    const item = result[key];

    return `
      <div class="result-row">
        <div class="label">
          ${iconFor(key)}
          ${item.label}
        </div>

        <div class="value">
          ${formatNumber(item.value)}
          <span class="u">${item.unit}</span>
        </div>
      </div>
    `;
  }).join("");

  resultCard.innerHTML = `
    <div class="result-title">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2d5a8f"
        stroke-width="2.5"
        aria-hidden="true"
      >
        <path d="M4 12 L9 17 L20 6"/>
      </svg>

      Результат — ${FIGURES[currentFigure].name}
    </div>

    ${rows}
  `;

  resultCard.classList.add("show");

  setTimeout(() => {
    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 80);
}


/* ============================================================
   ОБРАБОТЧИКИ СОБЫТИЙ
   ============================================================ */

calcBtn.addEventListener("click", calculate);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    document.activeElement?.tagName === "INPUT"
  ) {
    calculate();
  }
});


/* ============================================================
   ЗАПУСК ПРИЛОЖЕНИЯ
   ============================================================ */

renderFiguresGrid();
renderParams();
