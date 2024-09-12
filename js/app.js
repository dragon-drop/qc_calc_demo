(function (window) {
  "use strict";
  const { div, form, h1, h2, input, label, p, section } = van.tags;
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
    const isSelected = van.derive(() => selectProgram == program.id);
    const id = `program_${program.id}`;
    return div(
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

  const Form = () => {
    return form(
      div(
        label("Qc Ceiling"),
        input({
          type: "number",
          step: 0.01,
          onchange: (e) => {
            qcCeiling.val = parseFloat(e.target.value);
          },
        }),
      ),
      div(
        label("Original Contract Cash"),
        input({
          type: "number",
          step: 0.01,
          onchange: (e) => (contractCash.val = parseFloat(e.target.value)),
        }),
      ),
      div(
        label("Original Contract Finance"),
        input({
          type: "number",
          step: 0.01,
          onchange: (e) => (contractFinance.val = parseFloat(e.target.value)),
        }),
      ),
    );
  };

  const Calculations = () => {
    const amountFeeAppliesTo = van.derive(
      () => qcCeiling.val + contractFinance.val,
    );
    const fee = van.derive(
      () => programs.find((p) => p.id === selectedProgram.val).fee,
    );

    const displayFee = van.derive(() => fee.val * 100);
    const additionalCharge = van.derive(() => amountFeeAppliesTo.val * fee.val);

    const newCeiling = van.derive(() => qcCeiling.val + additionalCharge.val);
    return div(
      div("Amount to apply fee to:", amountFeeAppliesTo),
      div("fee: ", displayFee, "%"),
      div("additionalCharge", additionalCharge),
      h1("The new QC ceiling is", newCeiling),
    );
  };

  const QcCalculator = () => {
    return section(
      h1("QC Calculator"),
      h2("Programs:"),
      programs.map(Program),
      Form,
      Calculations,
    );
  };

  van.add(document.body, QcCalculator());
})(window);
