# ExecPlan convention

For a change that touches more than one of the three major layers (music brain, mobile agents, structure renderer), write a short plan before editing code.

Every plan should state:

- observed visual problem;
- confirmed code-level cause;
- files/nodes to change;
- invariants that must not regress;
- validation steps;
- rollback path.

Do not solve visual problems only by retuning parameters when the behavior comes from incorrect state or shader logic.
