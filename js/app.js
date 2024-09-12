(function (window) {
  "use strict";
  const { div, h1, h2, input, label, section } = van.tags;

  let state = {
    programs: [
      {
        id: 1,
        apr: 11.9,
        term: 120,
        monthly_payment_factor: 0.014347,
        fee: 0,
        selected: van.state(false),
      },
      {
        id: 2,
        apr: 11.9,
        term: 144,
        monthly_payment_factor: 0.013134,
        fee: 0,
        selected: van.state(false),
      },
      {
        id: 3,
        apr: 11.9,
        term: 180,
        monthly_payment_factor: 0.012001,
        fee: 0,
        selected: van.state(false),
      },
      {
        id: 4,
        apr: 9.9,
        term: 120,
        monthly_payment_factor: 0.01322,
        fee: 0.06,
        selected: van.state(false),
      },
      {
        id: 5,
        apr: 9.9,
        term: 144,
        monthly_payment_factor: 0.012,
        fee: 0.06,
        selected: van.state(false),
      },
      {
        id: 6,
        apr: 9.9,
        term: 180,
        monthly_payment_factor: 0.0107,
        fee: 0.06,
        selected: van.state(false),
      },
      {
        id: 7,
        apr: 7.9,
        term: 120,
        monthly_payment_factor: 0.0121,
        fee: 0.1,
        selected: van.state(false),
      },
      {
        id: 8,
        apr: 7.9,
        term: 144,
        monthly_payment_factor: 0.0108,
        fee: 0.11,
        selected: van.state(false),
      },
      {
        id: 9,
        apr: 7.9,
        term: 180,
        monthly_payment_factor: 0.00955,
        fee: 0.12,
        selected: van.state(false),
      },
      {
        id: 10,
        apr: 0.0,
        term: 36,
        monthly_payment_factor: 0.027778,
        fee: 0.15,
        selected: van.state(false),
      },
    ],
  };

  const selectProgram = (id) =>
    (state = {
      ...state,
      programs: state.programs.map((program) =>
        program.id == id ? { ...program, selected: van.state(true) } : program,
      ),
    });

  const Program = (program) => {
    const isSelected = van.derive(() => program.selected);
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

  const QcCalculator = () => {
    console.log({ state });
    return section(
      h1("QC Calculator"),
      h2("Programs:"),
      state.programs.map(Program),
    );
  };

  van.add(document.body, QcCalculator());
})(window);
