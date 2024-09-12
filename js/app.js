(function (window) {
  "use strict";
  const { br, div, form, header, hr, h1, h2, input, label, p, section, span } =
    van.tags;
  let programs = [
    {
      id: 1,
      apr: 11.9,
      term: 120,
      monthly_payment_factor: 0.014347,
      fee: 0,
    },
    {
      id: 2,
      apr: 11.9,
      term: 144,
      monthly_payment_factor: 0.013134,
      fee: 0,
    },
    {
      id: 3,
      apr: 11.9,
      term: 180,
      monthly_payment_factor: 0.012001,
      fee: 0,
    },
    {
      id: 4,
      apr: 9.9,
      term: 120,
      monthly_payment_factor: 0.01322,
      fee: 0.06,
    },
    {
      id: 5,
      apr: 9.9,
      term: 144,
      monthly_payment_factor: 0.012,
      fee: 0.06,
    },
    {
      id: 6,
      apr: 9.9,
      term: 180,
      monthly_payment_factor: 0.0107,
      fee: 0.06,
    },
    {
      id: 7,
      apr: 7.9,
      term: 120,
      monthly_payment_factor: 0.0121,
      fee: 0.1,
    },
    {
      id: 8,
      apr: 7.9,
      term: 144,
      monthly_payment_factor: 0.0108,
      fee: 0.11,
    },
    {
      id: 9,
      apr: 7.9,
      term: 180,
      monthly_payment_factor: 0.00955,
      fee: 0.12,
    },
    {
      id: 10,
      apr: 0.0,
      term: 36,
      monthly_payment_factor: 0.027778,
      fee: 0.15,
    },
  ];

  const selectedProgram = van.state(1);
  const contractFinance = van.state(0);
  const contractCash = van.state(0);
  const qcCeiling = van.state(0);

  const selectProgram = (id) => (selectedProgram.val = parseInt(id));

  const Program = (program) => {
    const isSelected = van.derive(() => selectedProgram.val === program.id);
    const id = `program_${program.id}`;
    return div(
      {
        class: `p-3 border-b border-b-2 border-orange-900 ${isSelected.val ? "text-white bg-orange-500" : ""}`,
      },
      input({
        type: "radio",
        checked: isSelected.val,
        id,
        name: "selected_program",
        onchange: () => selectProgram(program.id),
      }),
      label({ for: id }, `${program.apr}%, ${program.term} months`),
    );
  };

  const Dollar = (field) =>
    div(
      {
        class: "border border-2 border-slate-300 text-xl rounded-md px-3 py-2",
      },
      span({ class: "mr-2 text-slate-400 font-bold text-base" }, "$"),
      field,
    );

  const Form = () => {
    return form(
      div(
        { class: "mb-2 w-full" },
        label(
          { class: "text-sm text-slate-500 font-bold uppercase mb-2" },
          "Qc Ceiling",
        ),
        Dollar(
          input({
            type: "number",
            step: 0.01,
            onchange: (e) => {
              qcCeiling.val = parseFloat(e.target.value);
            },
          }),
        ),
      ),
      div(
        { class: "mb-2 w-full" },
        label(
          { class: "text-sm text-slate-500 font-bold uppercase mb-2" },
          "Original Contract Cash",
        ),
        Dollar(
          input({
            type: "number",
            step: 0.01,
            onchange: (e) => (contractCash.val = parseFloat(e.target.value)),
          }),
        ),
      ),
      div(
        { class: "mb-2 w-full" },
        label(
          { class: "text-sm text-slate-500 font-bold uppercase mb-2" },
          "Original Contract Finance",
        ),
        Dollar(
          input({
            type: "number",
            step: 0.01,
            onchange: (e) => (contractFinance.val = parseFloat(e.target.value)),
          }),
        ),
      ),
    );
  };

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const Calculations = () => {
    const amountFeeAppliesTo = van.derive(
      () => qcCeiling.val + contractFinance.val,
    );
    const fee = van.derive(
      () => programs.find((p) => p.id === selectedProgram.val).fee,
    );

    const displayAmountFeeAppliesTo = van.derive(() =>
      currency.format(amountFeeAppliesTo.val),
    );
    const displayFee = van.derive(() => fee.val * 100);
    const additionalCharge = van.derive(() => amountFeeAppliesTo.val * fee.val);
    const displayAdditionalCharge = van.derive(() =>
      currency.format(additionalCharge.val),
    );

    const newCeiling = van.derive(() => qcCeiling.val + additionalCharge.val);
    const displayNewCeiling = van.derive(() => currency.format(newCeiling.val));

    return div(
      h2({ class: "text-lg font-bold mb-2 text-slate-500" }, "Outcome:"),
      div(
        { class: "flex gap-8 mb-2" },
        div(
          { class: "text-sm text-slate-500 font-bold uppercase mb-2" },
          "Amount to apply fee to:",
          br(),
          span({ class: "text-3xl text-slate-900" }, displayAmountFeeAppliesTo),
        ),
        div(
          { class: "text-sm text-slate-500 font-bold uppercase mb-2" },
          "Fee: ",
          br(),
          span({ class: "text-3xl text-slate-900" }, displayFee, "%"),
        ),
      ),
      div(
        { class: "text-sm text-slate-300 font-bold uppercase mb-4" },
        "Additional Charge: ",
        span(displayAdditionalCharge),
      ),
      div(
        { class: "text-sm font-bold uppercase mb-2 text-orange-500" },
        "The new QC ceiling is",
        br(),
        span({ class: "text-3xl" }, displayNewCeiling),
      ),
    );
  };

  const Programs = () =>
    div(
      {
        class:
          "mb-4 border border-2 border-orange-900 rounded-md bg-orange-100 bg-clip-padding",
      },
      programs.map(Program),
    );

  const QcCalculator = () => {
    return [
      header(
        { class: "p-8 text-white" },
        h1({ class: "text-2xl font-bold" }, "QC Calculator"),
      ),
      div(
        { class: "container mx-auto px-4 py-4 pb-8 bg-white rounded-lg" },
        section(
          h2({ class: "text-2xl font-bold" }, "Select a program:"),
          Programs,
          h2(
            { class: "text-lg font-bold mb-2 text-slate-500" },
            "Enter project finance:",
          ),
          Form,
          hr({ class: "my-6 border-2 border-orange-500" }),
          Calculations,
        ),
      ),
    ];
  };

  van.add(document.body, QcCalculator());
})(window);
