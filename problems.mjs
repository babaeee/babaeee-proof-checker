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

const emptyContext = `
Ltac normalize := intros.

Ltac kalbas_auto := normalize.

Ltac replace_goal g := assert (g); kalbas_auto; normalize.
`;

const arithContext = `
Require Import Arith.
Require Import Omega.
Ltac normalize := intros.

Ltac kalbas_auto := try omega; auto; normalize.

Ltac replace_goal g := assert (g); kalbas_auto; normalize.
`;

const p3Context = `
${arithContext}
Lemma pow_lt_mono_2: forall a b : nat, a < b -> 2 ^ a < 2 ^ b.
Proof.
  intros.
  apply Nat.pow_lt_mono_r; auto.
Qed.
`;

const p5Context = `
${p3Context}
Lemma helper_1: forall a b: nat, a < b -> S (a) < 2 * b.
Proof.
  intros.
  omega.
Qed.

Lemma x_lt_pow_2 : forall x : nat , x < 2 ^ x.
Proof.
  intros.
  induction x.
  auto.
  assert (2 ^ S x = 2 * 2 ^ x).
  auto.
  rewrite H.
  apply helper_1.
  auto.
Qed.
`

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

const s = [
`
سلام. به اثبات چک کن خوش اومدی. توی این جا اثبات رو توی این محیط گرافیکی به ما
منتقل می کنی و ما بررسی می کنیم که درست باشه. توی چند مرحله که این مرحله اولشه
قراره یاد بگیری که چجوری می تونی اثبات رو به کامپیوتر بفهمونی.
توی صفحه ای که می بینی وضعیت اثبات نشون داده شده. چیزایی که بالای خط نوشته مفروضات
ما و چیزی که زیر خط نوشته چیزیه که باید ثابتش کنیم. الان ما دو تا قرض داریم. فرض
اول می گه که یه آدمی غرق شده و فرض دوم می گه که اگه آدمه غرق بشه میمیره. حالا
ما باید ثابت کنیم که اون آدمه مرده.
برای این کار فرض دوم رو درگ کن (فعلا درگ دراپ پیاده نشده، روش کلیک کن) بعد روی حکم
دراپش کن. وقتی این کارو کنی (این جا بهتره که یه آموزش اینتراکتیوی باشه که وقتی
این کارو کردی متن بعدی رو نشون بده) به جای این که بخواد مردن یارو رو ثابت کنی، کافیه
که غرق شدن یارو رو ثابت کنی چون غرق شدنش مردنش رو نتیجه می ده. حالا که هدف تغییر کرده
به غرق شدن و غرق شدن تو مفروضاتمون هست، فرض رو درگ دراپ کن تو حکم تا اثبات کامل شه.
`,
`
همون قبلیه ولی یکم پیچیده تره. به جهت گزاره های شرطی توجه کن.
مثلا ما می دونیم که اگه یارو بمیره نفس هم نمی کشه ولی این تو اثبات این که یارو
مرده به ما کمک نمی کنه.
`,
`
مسائل انتزاعی زیاد باحال نیستن. پس بیا یکم عدد قاطی بازی کنیم. توی این بخش باید
ثابت کنی که دو بتوان سه از دو بتوان صد کمتره. فرض اول اینه که می دونیم
سه از صد کمتره و فرض دوم می گه که اگه یه عدد طبیعی مثل آ از یه عدد مثل ب کمتر باشه، دو
به توانشون هم همین طوره. اثبات کاملا مثل قبله. فرض ها رو توی حکم درگ دراپ کن تا حکم
رو ثابت کنی.
`,
`
اینم همون مساله قبلیه. اون فرضی که توی سوال قبل داشتیم حقیقتا نمی شد بهش فرض گفت
و یه چیزیه که مستقل از شرایط درسته و ثابت می شه. به خاطر همین بردیمش توی پالت
قضیه ها (مثل پالت نقاشیه ولی به جای رنگ توش قضیه داره) اگه ماوس رو روش نگه داری
توضیح می ده که گزاره این قضیه دقیقا چیه. مثل مساله قبل حکم رو ثابت کن تا ادامه
بدیم.
`,
`
فرض دوم هم که می گفت سه از صد کوچیک تره واقعا فرض نیست. اون حتی قضیه هم نیست. یه
گزاره بدیهیه که از تعریف 3 و 100 و تعریف کوچکتر بودن نتیجه می شه. اگر چه می شه
این تعاریف رو باز کرد و به صورت دستی این رو نتیجه گرفت ولی ما نمی خوایم اذیتت کنیم
پس اگه دکمه اثبات خودکار که جدید اضافه شده رو بزنی خودمون چیزایی که بدیهیه رو
هندل می کنیم.
ممکنه واست سوال پیش بیاد که چه چیزایی رو اثبات خودکار می پذیره. جواب این سوال
اصلا آسون نیست. حتی ما سطح هوشمندی اثبات خودکار رو توی سوالای مختلف عوض می کنیم چون
بعضی از سوالا رو اثبات خودکار از بیخ ثابت می کنه.
وقتی که آموزش تموم شه، ما یه گزینه اضافه می کنیم که خودکار همه جا از اثبات خودکار
استفاده کنه. ولی چون اون ممکنه باعث شه که نفهمی داره چه اتفاقی میفته، الان
فعال نیست و باید دستی از اثبات خودکار استفاده کنی.
`,
`
یه چیز کوچولو دیگه هم یاد بگیریم بعد بریم چیز درست درمون ثابت کنیم. توی این سوال
می خوایم ثابت کنیم که ده از دو به توان صد کوچیک تره. این رو با قضیه ترایایی بودن
مقایسه توی اعداد طبیعی ثابت می کنیم. (اگه نمی دونی ترایایی چیه ماوس رو روی
قضیه ببر تا نشون بده که چیه) نرم افزاری که ما توی پشت این اثبات چک کن ازش استفاده
می کنیم (کوک) واقعا نرم افزار هوشمندیه و اگه برای این که بفهمید چقدر هوشمنده، می تونید
به این فکر کنید که چجوری خودتون می تونید اون رو پیاده سازی کنید. ولی با تمام این
هوشمندی، خیلی از چیز ها رو یا اشتباه می فهمه و یا نمی تونه بفهمه (و این به علت
عدم هوشمندیش نیست، بعضی وقت ها کلا نمی شه فهمید) مثلا این جا اگر شما بخواید از قضیه
ترایایی مقایسه استفاده کنید، اون نمی تونه بفهمه که شما چه ام ای رو در ذهنتون دارید
و اصلا هیچ کس نمی تونه بفهمه چون شما ممکنه توی ذهنتون دو بتوان پنج باشه یا دو بتوان
ده باشه یا اصلا 3 باشه! پس به صورت دستی بگید که چه ام ای مد نظرتون هست. توجه کنید که
اگر هوشمندی کوک نبود باید ان و پی رو هم خودتون دستی مشخص می کردید ولی کوک می فهمه که
برای اثبات هدف ان باید ده باشه و پی باید دو بتوان صد باشه.

اگر همین طوری تلاش کنید که
قضیه ترایایی رو روی هدف اعمال کنید بهتون ارور می ده که نمی دونم جای ام باید چی بزارم
ولی اگه شیفت رو نگه دارید و بعد درگ دراپ رو انجام بدید، ازتون می پرسه که با چه پارامتر
هایی؟ شما اون جا می تونید بنویسید:
m:=2^10
و بعد اثبات رو ادامه بدید.
`,
]

export const problems = [
  {
    context: emptyContext,
    statement: s[0],
    goal: 'forall ghargh_shodan mordan: Prop, ghargh_shodan -> (ghargh_shodan -> mordan) -> mordan',
  },
  {
    context: emptyContext,
    statement: s[1],
    goal: 'forall ghargh_shodan nafas_nakeshidan mordan: Prop, ghargh_shodan -> (ghargh_shodan -> nafas_nakeshidan) -> (mordan -> nafas_nakeshidan) -> (nafas_nakeshidan -> mordan) -> mordan',
  },
  {
    context: arithContext,
    statement: s[2],
    goal: '(3 < 100) -> (forall a b: nat, a < b -> 2 ^ a < 2 ^ b) -> 2 ^ 3 < 2 ^ 100',
  },
  {
    context: p3Context,
    statement: s[3],
    pallete: {
      'pow_lt_mono_2': 'مقایسه توان های دو',
    },
    goal: '(3 < 100) -> 2 ^ 3 < 2 ^ 100',
  },
  {
    context: p3Context,
    statement: s[4],
    pallete: {
      'pow_lt_mono_2': 'مقایسه توان های دو',
    },
    goal: '2 ^ 3 < 2 ^ 100',
  },
  {
    context: p5Context,
    statement: s[5],
    pallete: {
      'pow_lt_mono_2': 'مقایسه توان های دو',
      'Nat.lt_trans': 'ترایایی بودن مقایسه',
      'x_lt_pow_2': 'هر عدد طبیعی از توان دو اش کوچک تر است',
    },
    goal: '10 < 2 ^ 100',
  },
  {
    context: hesabiContext,
    goal: 'forall x y: R, (((x + y) / 2) ^ 2 >= x*y)%R',
    pallete: {
      'pow2_ge_0': 'نا برابری توان دو',
      'Rtotal_order': 'ترتیب کامل در اعداد حقیقی',
    },
  },
  {
    context: fiboContext,
    goal: 'forall n: nat, fibo_sum n = fibo (n + 1) - 1',
    pallete: ['nat_ind', 'fibo_def'],  
  },
];
