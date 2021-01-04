const hesabiContext = `
Require Import Reals.
Require Import Lra.

Open Scope R.

Ltac normalize := intuition; try match goal with
  | [ |- (_ >= _)%R ] => apply Rle_ge
end.

Ltac kalbas_auto := try field; try lra; eauto.

Ltac replace_goal g := assert (g); kalbas_auto; normalize.

`;

const fiboContext = `
Require Import Omega.
Require Import Ring.

Ltac normalize := intuition.

Ltac kalbas_auto := try ring; try omega; eauto.

Ltac replace_goal g := assert (g); kalbas_auto; normalize.


Fixpoint fibo (n: nat) :=
  match n with
  | 0 => 1
  | (S x) => match x with
             | 0 => 1
             | S y => fibo x + fibo y
              end
  end.

Lemma fibo_def: forall n: nat, fibo (n + 2) = fibo (n + 1) + fibo n.
Proof.
  normalize.
  replace_goal (n + 2 = S (S n)).
  rewrite H.
  replace_goal (n + 1 = (S n)).
  rewrite H0.
  auto.
Qed.

Fixpoint fibo_sum (n: nat) := match n with
| 0 => 0
| S n => fibo_sum n + fibo n
end.

`;

export const problems = {
  hesabi: {
    context: hesabiContext,
    goal: 'forall x y: R, (((x + y) / 2) ^ 2 >= x*y)%R',
    pallete: ['pow2_ge_0', 'Rtotal_order'],
  },
  fibo: {
    context: fiboContext,
    goal: 'forall n: nat, fibo_sum n = fibo (n + 1) - 1',
    pallete: ['nat_ind', 'fibo_def'],  
  },
};
