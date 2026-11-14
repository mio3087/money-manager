
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, TrendingUp, TrendingDown, Wallet, Target,
  BookOpen, BarChart3, Plus, Search, Pencil, Trash2, X,
  Menu, Globe, ArrowUpRight, ArrowDownRight, CalendarDays,
  PiggyBank, Receipt, ChevronRight, Sparkles,
} from "lucide-react";

const STORAGE_KEY = "money-manager-v1";

const LANGUAGES = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "ko", label: "한국어" },
];

const INITIAL_DATA = {
  language: "ja",
  transactions: [],
  goals: [],
  memories: [],
};

const TEXT = {
  ja: {
    app: "Money Manager", overview: "概要", income: "収入",
    expenses: "支出", wallets: "ウォレット", goals: "貯金目標",
    memories: "Money Memory", reports: "レポート",
    totalBalance: "総資産", monthlyIncome: "今月の収入",
    monthlyExpenses: "今月の支出", monthlyBalance: "今月の収支",
    recentTransactions: "最近の取引", allTransactions: "取引一覧",
    noTransactions: "取引はまだありません",
    noTransactionsHint: "最初の収入または支出を登録してみましょう。",
    addTransaction: "取引を追加", editTransaction: "取引を編集",
    addIncome: "収入を追加", addExpense: "支出を追加",
    incomeType: "収入", expenseType: "支出",
    title: "内容", amount: "金額", currency: "通貨",
    category: "カテゴリー", date: "日付", note: "メモ",
    notePlaceholder: "補足や詳細を入力",
    titlePlaceholder: "内容を入力してください",
    save: "保存する", cancel: "キャンセル", delete: "削除",
    edit: "編集", confirmDelete: "この項目を削除しますか？",
    walletsTitle: "通貨別ウォレット",
    walletDescription: "登録した取引をもとに残高を表示します。",
    goalsTitle: "貯金目標", addGoal: "目標を追加",
    editGoal: "目標を編集", goalName: "目標名",
    goalNamePlaceholder: "目標の名前を入力",
    targetAmount: "目標金額", savedAmount: "現在の貯金額",
    progress: "達成率", remaining: "あと",
    noGoals: "貯金目標はまだありません",
    noGoalsHint: "これから叶えたい目標を登録してみましょう。",
    memoriesTitle: "Money Memory", addMemory: "記録を追加",
    editMemory: "記録を編集", memoryName: "記録のタイトル",
    memoryNamePlaceholder: "タイトルを入力",
    memoryAmount: "金額", memoryDate: "日付",
    memoryNote: "詳細・振り返り",
    noMemories: "記録はまだありません",
    noMemoriesHint: "お金にまつわる出来事や思い出を残しましょう。",
    reportsTitle: "レポート", incomeTotal: "収入合計",
    expenseTotal: "支出合計", balance: "収支",
    categoryBreakdown: "カテゴリー別支出",
    noReport: "まだ集計できる取引がありません。",
    searchPlaceholder: "取引を検索...", all: "すべて",
    yen: "日本円", usd: "米ドル", twd: "台湾ドル",
    krw: "韓国ウォン", empty: "データがありません",
    required: "内容と金額を入力してください。",
    invalidAmount: "金額を正しく入力してください。",
    deleteGoal: "この貯金目標を削除しますか？",
    deleteMemory: "この記録を削除しますか？",
    thisMonth: "今月", total: "合計",
    transactionsCount: "件の取引", language: "表示言語",
    addFirstGoal: "最初の目標を登録する",
    goalOverview: "あなたが叶えたいこと",
    goalHint: "小さな積み重ねを、未来の楽しみにつなげましょう。",
    noGoalOverview: "これから叶えたいことを、ここに。",
    goalManage: "目標を管理する",
    other: "その他", close: "閉じる",
  },
  en: {
    app: "Money Manager", overview: "Overview", income: "Income",
    expenses: "Expenses", wallets: "Wallets", goals: "Savings Goals",
    memories: "Money Memory", reports: "Reports",
    totalBalance: "Total Balance", monthlyIncome: "Income This Month",
    monthlyExpenses: "Expenses This Month", monthlyBalance: "Monthly Balance",
    recentTransactions: "Recent Transactions", allTransactions: "Transactions",
    noTransactions: "No transactions yet",
    noTransactionsHint: "Add your first income or expense.",
    addTransaction: "Add Transaction", editTransaction: "Edit Transaction",
    addIncome: "Add Income", addExpense: "Add Expense",
    incomeType: "Income", expenseType: "Expense",
    title: "Description", amount: "Amount", currency: "Currency",
    category: "Category", date: "Date", note: "Note",
    notePlaceholder: "Add details", titlePlaceholder: "Enter a description",
    save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit",
    confirmDelete: "Delete this item?",
    walletsTitle: "Currency Wallets",
    walletDescription: "Balances are calculated from your transactions.",
    goalsTitle: "Savings Goals", addGoal: "Add Goal",
    editGoal: "Edit Goal", goalName: "Goal Name",
    goalNamePlaceholder: "Enter a goal name",
    targetAmount: "Target Amount", savedAmount: "Amount Saved",
    progress: "Progress", remaining: "Remaining",
    noGoals: "No savings goals yet",
    noGoalsHint: "Add something you would love to achieve.",
    memoriesTitle: "Money Memory", addMemory: "Add Memory",
    editMemory: "Edit Memory", memoryName: "Title",
    memoryNamePlaceholder: "Enter a title", memoryAmount: "Amount",
    memoryDate: "Date", memoryNote: "Details",
    noMemories: "No memories yet",
    noMemoriesHint: "Keep a record of meaningful money moments.",
    reportsTitle: "Reports", incomeTotal: "Total Income",
    expenseTotal: "Total Expenses", balance: "Balance",
    categoryBreakdown: "Expenses by Category",
    noReport: "Not enough transaction data yet.",
    searchPlaceholder: "Search transactions...", all: "All",
    yen: "Japanese Yen", usd: "US Dollar", twd: "Taiwan Dollar",
    krw: "Korean Won", empty: "No data",
    required: "Please enter a description and amount.",
    invalidAmount: "Please enter a valid amount.",
    deleteGoal: "Delete this savings goal?",
    deleteMemory: "Delete this memory?",
    thisMonth: "This Month", total: "Total",
    transactionsCount: "transactions", language: "Language",
    addFirstGoal: "Create your first goal",
    goalOverview: "What you're looking forward to",
    goalHint: "Turn small steps into something meaningful.",
    noGoalOverview: "Your next goal starts here.",
    goalManage: "Manage goals",
    other: "Other", close: "Close",
  },
  "zh-CN": {
    app: "Money Manager", overview: "总览", income: "收入",
    expenses: "支出", wallets: "钱包", goals: "储蓄目标",
    memories: "Money Memory", reports: "报告",
    totalBalance: "总资产", monthlyIncome: "本月收入",
    monthlyExpenses: "本月支出", monthlyBalance: "本月结余",
    recentTransactions: "最近交易", allTransactions: "交易记录",
    noTransactions: "还没有交易记录",
    noTransactionsHint: "添加第一笔收入或支出吧。",
    addTransaction: "添加交易", editTransaction: "编辑交易",
    addIncome: "添加收入", addExpense: "添加支出",
    incomeType: "收入", expenseType: "支出",
    title: "内容", amount: "金额", currency: "货币",
    category: "类别", date: "日期", note: "备注",
    notePlaceholder: "输入补充信息", titlePlaceholder: "请输入内容",
    save: "保存", cancel: "取消", delete: "删除", edit: "编辑",
    confirmDelete: "确定删除此项目吗？",
    walletsTitle: "各币种钱包",
    walletDescription: "根据已登记的交易计算余额。",
    goalsTitle: "储蓄目标", addGoal: "添加目标",
    editGoal: "编辑目标", goalName: "目标名称",
    goalNamePlaceholder: "请输入目标名称",
    targetAmount: "目标金额", savedAmount: "已存金额",
    progress: "完成率", remaining: "还差",
    noGoals: "还没有储蓄目标",
    noGoalsHint: "添加一个自己想实现的目标吧。",
    memoriesTitle: "Money Memory", addMemory: "添加记录",
    editMemory: "编辑记录", memoryName: "记录标题",
    memoryNamePlaceholder: "请输入标题", memoryAmount: "金额",
    memoryDate: "日期", memoryNote: "详细内容",
    noMemories: "还没有记录",
    noMemoriesHint: "记录与金钱有关的事情和回忆。",
    reportsTitle: "报告", incomeTotal: "收入合计",
    expenseTotal: "支出合计", balance: "收支结余",
    categoryBreakdown: "类别支出",
    noReport: "目前还没有可统计的数据。",
    searchPlaceholder: "搜索交易...", all: "全部",
    yen: "日元", usd: "美元", twd: "新台币",
    krw: "韩元", empty: "暂无数据",
    required: "请输入内容和金额。",
    invalidAmount: "请输入有效金额。",
    deleteGoal: "确定删除此储蓄目标吗？",
    deleteMemory: "确定删除此记录吗？",
    thisMonth: "本月", total: "合计",
    transactionsCount: "笔交易", language: "显示语言",
    addFirstGoal: "创建第一个目标",
    goalOverview: "想要实现的目标",
    goalHint: "让每一点积累都成为未来的期待。",
    noGoalOverview: "从这里开始设定你的目标。",
    goalManage: "管理目标",
    other: "其他", close: "关闭",
  },
  "zh-TW": {
    app: "Money Manager", overview: "總覽", income: "收入",
    expenses: "支出", wallets: "錢包", goals: "儲蓄目標",
    memories: "Money Memory", reports: "報告",
    totalBalance: "總資產", monthlyIncome: "本月收入",
    monthlyExpenses: "本月支出", monthlyBalance: "本月結餘",
    recentTransactions: "最近交易", allTransactions: "交易紀錄",
    noTransactions: "還沒有交易紀錄",
    noTransactionsHint: "新增第一筆收入或支出吧。",
    addTransaction: "新增交易", editTransaction: "編輯交易",
    addIncome: "新增收入", addExpense: "新增支出",
    incomeType: "收入", expenseType: "支出",
    title: "內容", amount: "金額", currency: "貨幣",
    category: "類別", date: "日期", note: "備註",
    notePlaceholder: "輸入補充資訊", titlePlaceholder: "請輸入內容",
    save: "儲存", cancel: "取消", delete: "刪除", edit: "編輯",
    confirmDelete: "確定刪除此項目嗎？",
    walletsTitle: "各幣別錢包",
    walletDescription: "依照已登記的交易計算餘額。",
    goalsTitle: "儲蓄目標", addGoal: "新增目標",
    editGoal: "編輯目標", goalName: "目標名稱",
    goalNamePlaceholder: "請輸入目標名稱",
    targetAmount: "目標金額", savedAmount: "已存金額",
    progress: "完成率", remaining: "還差",
    noGoals: "還沒有儲蓄目標",
    noGoalsHint: "新增一個自己想實現的目標吧。",
    memoriesTitle: "Money Memory", addMemory: "新增紀錄",
    editMemory: "編輯紀錄", memoryName: "紀錄標題",
    memoryNamePlaceholder: "請輸入標題", memoryAmount: "金額",
    memoryDate: "日期", memoryNote: "詳細內容",
    noMemories: "還沒有紀錄",
    noMemoriesHint: "記錄與金錢有關的事情和回憶。",
    reportsTitle: "報告", incomeTotal: "收入合計",
    expenseTotal: "支出合計", balance: "收支結餘",
    categoryBreakdown: "類別支出",
    noReport: "目前還沒有可統計的資料。",
    searchPlaceholder: "搜尋交易...", all: "全部",
    yen: "日圓", usd: "美元", twd: "新台幣",
    krw: "韓元", empty: "暫無資料",
    required: "請輸入內容和金額。",
    invalidAmount: "請輸入有效金額。",
    deleteGoal: "確定刪除此儲蓄目標嗎？",
    deleteMemory: "確定刪除此紀錄嗎？",
    thisMonth: "本月", total: "合計",
    transactionsCount: "筆交易", language: "顯示語言",
    addFirstGoal: "建立第一個目標",
    goalOverview: "想要實現的目標",
    goalHint: "讓每一點累積都成為未來的期待。",
    noGoalOverview: "從這裡開始設定你的目標。",
    goalManage: "管理目標",
    other: "其他", close: "關閉",
  },
  ko: {
    app: "Money Manager", overview: "개요", income: "수입",
    expenses: "지출", wallets: "지갑", goals: "저축 목표",
    memories: "Money Memory", reports: "리포트",
    totalBalance: "총 자산", monthlyIncome: "이번 달 수입",
    monthlyExpenses: "이번 달 지출", monthlyBalance: "이번 달 잔액",
    recentTransactions: "최근 거래", allTransactions: "전체 거래",
    noTransactions: "아직 거래가 없습니다",
    noTransactionsHint: "첫 수입 또는 지출을 등록해 보세요.",
    addTransaction: "거래 추가", editTransaction: "거래 수정",
    addIncome: "수입 추가", addExpense: "지출 추가",
    incomeType: "수입", expenseType: "지출",
    title: "내용", amount: "금액", currency: "통화",
    category: "카테고리", date: "날짜", note: "메모",
    notePlaceholder: "추가 정보 입력", titlePlaceholder: "내용을 입력하세요",
    save: "저장", cancel: "취소", delete: "삭제", edit: "수정",
    confirmDelete: "이 항목을 삭제할까요?",
    walletsTitle: "통화별 지갑",
    walletDescription: "등록된 거래를 기준으로 잔액을 계산합니다.",
    goalsTitle: "저축 목표", addGoal: "목표 추가",
    editGoal: "목표 수정", goalName: "목표 이름",
    goalNamePlaceholder: "목표 이름을 입력하세요",
    targetAmount: "목표 금액", savedAmount: "현재 저축액",
    progress: "달성률", remaining: "남은 금액",
    noGoals: "아직 저축 목표가 없습니다",
    noGoalsHint: "이루고 싶은 목표를 추가해 보세요.",
    memoriesTitle: "Money Memory", addMemory: "기록 추가",
    editMemory: "기록 수정", memoryName: "기록 제목",
    memoryNamePlaceholder: "제목을 입력하세요", memoryAmount: "금액",
    memoryDate: "날짜", memoryNote: "상세 내용",
    noMemories: "아직 기록이 없습니다",
    noMemoriesHint: "돈과 관련된 일과 추억을 기록해 보세요.",
    reportsTitle: "리포트", incomeTotal: "총수입",
    expenseTotal: "총지출", balance: "수입·지출 차액",
    categoryBreakdown: "카테고리별 지출",
    noReport: "아직 집계할 거래가 없습니다.",
    searchPlaceholder: "거래 검색...", all: "전체",
    yen: "일본 엔", usd: "미국 달러", twd: "대만 달러",
    krw: "한국 원", empty: "데이터가 없습니다",
    required: "내용과 금액을 입력해 주세요.",
    invalidAmount: "올바른 금액을 입력해 주세요.",
    deleteGoal: "이 저축 목표를 삭제할까요?",
    deleteMemory: "이 기록을 삭제할까요?",
    thisMonth: "이번 달", total: "합계",
    transactionsCount: "건의 거래", language: "표시 언어",
    addFirstGoal: "첫 번째 목표 만들기",
    goalOverview: "이루고 싶은 목표",
    goalHint: "작은 저축을 미래의 즐거움으로 연결해 보세요.",
    noGoalOverview: "여기에서 새로운 목표를 시작하세요.",
    goalManage: "목표 관리",
    other: "기타", close: "닫기",
  },
};

const CATEGORY_LABELS = {
  Books: { ja: "本・教材", en: "Books", "zh-CN": "书籍・教材", "zh-TW": "書籍・教材", ko: "도서・교재" },
  Learning: { ja: "学習", en: "Learning", "zh-CN": "学习", "zh-TW": "學習", ko: "학습" },
  Travel: { ja: "旅行", en: "Travel", "zh-CN": "旅行", "zh-TW": "旅行", ko: "여행" },
  Food: { ja: "食費・飲食", en: "Food", "zh-CN": "餐饮", "zh-TW": "餐飲", ko: "식비・음식" },
  Shopping: { ja: "買い物", en: "Shopping", "zh-CN": "购物", "zh-TW": "購物", ko: "쇼핑" },
  Transport: { ja: "交通費", en: "Transport", "zh-CN": "交通费", "zh-TW": "交通費", ko: "교통비" },
  Beauty: { ja: "美容・身だしなみ", en: "Beauty", "zh-CN": "美容护理", "zh-TW": "美容保養", ko: "미용・관리" },
  Bills: { ja: "固定費・請求", en: "Bills", "zh-CN": "固定费用", "zh-TW": "固定費用", ko: "고정비・요금" },
  Salary: { ja: "給与", en: "Salary", "zh-CN": "工资", "zh-TW": "薪資", ko: "급여" },
  Lesson: { ja: "日本語レッスン収入", en: "Lesson Income", "zh-CN": "日语课程收入", "zh-TW": "日語課程收入", ko: "일본어 레슨 수입" },
  Pension: { ja: "年金", en: "Pension", "zh-CN": "养老金", "zh-TW": "年金", ko: "연금" },
  Other: { ja: "その他", en: "Other", "zh-CN": "其他", "zh-TW": "其他", ko: "기타" },
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS);
const CURRENCIES = ["JPY", "USD", "TWD", "KRW"];

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value, currency = "JPY", language = "ja") {
  const locale = {
    ja: "ja-JP", en: "en-US", "zh-CN": "zh-CN",
    "zh-TW": "zh-TW", ko: "ko-KR",
  }[language] || "ja-JP";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: ["JPY", "TWD", "KRW"].includes(currency) ? 0 : 2,
    }).format(safeNumber(value));
  } catch {
    return `${currency} ${safeNumber(value).toLocaleString()}`;
  }
}

function normalizeData(raw) {
  if (!raw || typeof raw !== "object") return INITIAL_DATA;

  return {
    language: LANGUAGES.some((x) => x.value === raw.language) ? raw.language : "ja",
    transactions: Array.isArray(raw.transactions)
      ? raw.transactions.map((x) => ({
          ...x,
          id: x.id || createId(),
          type: x.type === "income" ? "income" : "expense",
          title: x.title || "",
          amount: safeNumber(x.amount),
          currency: CURRENCIES.includes(x.currency) ? x.currency : "JPY",
          category: x.category || "Other",
          date: x.date || todayString(),
          note: x.note || "",
        }))
      : [],
    goals: Array.isArray(raw.goals)
      ? raw.goals.map((x) => ({
          ...x,
          id: x.id || createId(),
          name: x.name || "",
          target: safeNumber(x.target),
          saved: safeNumber(x.saved),
          currency: CURRENCIES.includes(x.currency) ? x.currency : "JPY",
          description: x.description || "",
        }))
      : [],
    memories: Array.isArray(raw.memories)
      ? raw.memories.map((x) => ({
          ...x,
          id: x.id || createId(),
          title: x.title || "",
          amount: safeNumber(x.amount),
          currency: CURRENCIES.includes(x.currency) ? x.currency : "JPY",
          date: x.date || todayString(),
          note: x.note || "",
        }))
      : [],
  };
}

function categoryLabel(category, language) {
  return CATEGORY_LABELS[category]?.[language] || category || "Other";
}

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("overview");
  const [modal, setModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [goalForm, setGoalForm] = useState(null);
  const [memoryForm, setMemoryForm] = useState(null);

  const language = data.language || "ja";
  const t = TEXT[language] || TEXT.ja;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(normalizeData(JSON.parse(saved)));
    } catch (error) {
      console.error("Could not load Money Manager data:", error);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Could not save Money Manager data:", error);
    }
  }, [data, loaded]);

  const currentMonth = todayString().slice(0, 7);

  const monthlyTransactions = useMemo(
    () => data.transactions.filter((x) => (x.date || "").slice(0, 7) === currentMonth),
    [data.transactions, currentMonth]
  );

  const monthlyIncome = monthlyTransactions
    .filter((x) => x.type === "income" && x.currency === "JPY")
    .reduce((sum, x) => sum + x.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((x) => x.type === "expense" && x.currency === "JPY")
    .reduce((sum, x) => sum + x.amount, 0);

  const walletBalances = useMemo(() => {
    const result = { JPY: 0, USD: 0, TWD: 0, KRW: 0 };
    data.transactions.forEach((x) => {
      const currency = x.currency || "JPY";
      if (!(currency in result)) result[currency] = 0;
      result[currency] += x.type === "income" ? x.amount : -x.amount;
    });
    return result;
  }, [data.transactions]);

  const filteredTransactions = useMemo(() => {
    let list = [...data.transactions];

    if (page === "income") list = list.filter((x) => x.type === "income");
    if (page === "expenses") list = list.filter((x) => x.type === "expense");

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      list = list.filter((x) =>
        [x.title, x.note, x.category, x.date].join(" ").toLowerCase().includes(keyword)
      );
    }

    return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [data.transactions, page, search]);

  const navItems = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "income", label: t.income, icon: TrendingUp },
    { id: "expenses", label: t.expenses, icon: TrendingDown },
    { id: "wallets", label: t.wallets, icon: Wallet },
    { id: "goals", label: t.goals, icon: Target },
    { id: "memories", label: t.memories, icon: BookOpen },
    { id: "reports", label: t.reports, icon: BarChart3 },
  ];

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);
    setSearch("");
  }

  function changeLanguage(nextLanguage) {
    setData((prev) => ({ ...prev, language: nextLanguage }));
  }

  function openNewTransaction(type = "expense") {
    setForm({
      id: null, type, title: "", amount: "", currency: "JPY",
      category: type === "income" ? "Lesson" : "Books",
      date: todayString(), note: "",
    });
    setModal("transaction");
  }

  function openEditTransaction(item) {
    setForm({ ...item, amount: String(item.amount) });
    setModal("transaction");
  }

  function saveTransaction(event) {
    event.preventDefault();
    if (!form?.title?.trim()) return alert(t.required);

    const amount = safeNumber(form.amount);
    if (amount <= 0) return alert(t.invalidAmount);

    const record = {
      ...form,
      id: form.id || createId(),
      title: form.title.trim(),
      amount,
      date: form.date || todayString(),
      note: form.note || "",
    };

    setData((prev) => ({
      ...prev,
      transactions: form.id
        ? prev.transactions.map((x) => x.id === form.id ? record : x)
        : [record, ...prev.transactions],
    }));
    setModal(null);
    setForm(null);
  }

  function deleteTransaction(id) {
    if (!window.confirm(t.confirmDelete)) return;
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((x) => x.id !== id),
    }));
  }

  function openNewGoal() {
    setGoalForm({
      id: null, name: "", target: "", saved: "",
      currency: "JPY", description: "",
    });
    setModal("goal");
  }

  function openEditGoal(goal) {
    setGoalForm({
      ...goal,
      target: String(goal.target),
      saved: String(goal.saved),
    });
    setModal("goal");
  }

  function saveGoal(event) {
    event.preventDefault();
    if (!goalForm?.name?.trim()) return alert(t.required);

    const target = safeNumber(goalForm.target);
    const saved = safeNumber(goalForm.saved);

    if (target <= 0 || saved < 0) return alert(t.invalidAmount);

    const record = {
      ...goalForm,
      id: goalForm.id || createId(),
      name: goalForm.name.trim(),
      target,
      saved,
      description: goalForm.description || "",
    };

    setData((prev) => ({
      ...prev,
      goals: goalForm.id
        ? prev.goals.map((x) => x.id === goalForm.id ? record : x)
        : [...prev.goals, record],
    }));
    setModal(null);
    setGoalForm(null);
  }

  function deleteGoal(id) {
    if (!window.confirm(t.deleteGoal)) return;
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((x) => x.id !== id),
    }));
  }

  function openNewMemory() {
    setMemoryForm({
      id: null, title: "", amount: "", currency: "JPY",
      date: todayString(), note: "",
    });
    setModal("memory");
  }

  function openEditMemory(memory) {
    setMemoryForm({ ...memory, amount: String(memory.amount) });
    setModal("memory");
  }

  function saveMemory(event) {
    event.preventDefault();
    if (!memoryForm?.title?.trim()) return alert(t.required);

    const amount = safeNumber(memoryForm.amount);
    if (amount < 0) return alert(t.invalidAmount);

    const record = {
      ...memoryForm,
      id: memoryForm.id || createId(),
      title: memoryForm.title.trim(),
      amount,
      date: memoryForm.date || todayString(),
      note: memoryForm.note || "",
    };

    setData((prev) => ({
      ...prev,
      memories: memoryForm.id
        ? prev.memories.map((x) => x.id === memoryForm.id ? record : x)
        : [record, ...prev.memories],
    }));
    setModal(null);
    setMemoryForm(null);
  }

  function deleteMemory(id) {
    if (!window.confirm(t.deleteMemory)) return;
    setData((prev) => ({
      ...prev,
      memories: prev.memories.filter((x) => x.id !== id),
    }));
  }

  if (!loaded) return <div className="app-loading">Money Manager</div>;

  return (
    <div className="app">
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Wallet size={19} /></div>
          <span>{t.app}</span>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-label">{t.overview}</div>
        <nav className="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="language-label">
            <Globe size={15} />
            <span>{t.language}</span>
          </div>
          <select
            className="language-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            {LANGUAGES.map((x) => (
              <option value={x.value} key={x.value}>{x.label}</option>
            ))}
          </select>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
          <div className="topbar-spacer" />
          <button className="primary-button" onClick={() => openNewTransaction("expense")}>
            <Plus size={17} /> {t.addTransaction}
          </button>
        </header>

        <div className="content">
          {page === "overview" && (
            <OverviewPage
              t={t}
              language={language}
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
              walletBalances={walletBalances}
              transactions={data.transactions}
              goals={data.goals}
              onAdd={openNewTransaction}
              onEdit={openEditTransaction}
              onDelete={deleteTransaction}
              onAddGoal={openNewGoal}
              onEditGoal={openEditGoal}
              onDeleteGoal={deleteGoal}
              onGo={navigate}
            />
          )}

          {(page === "income" || page === "expenses") && (
            <TransactionsPage
              t={t}
              language={language}
              page={page}
              transactions={filteredTransactions}
              search={search}
              setSearch={setSearch}
              onAdd={openNewTransaction}
              onEdit={openEditTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {page === "wallets" && (
            <WalletsPage t={t} language={language} balances={walletBalances} transactions={data.transactions} />
          )}

          {page === "goals" && (
            <GoalsPage
              t={t} language={language} goals={data.goals}
              onAdd={openNewGoal} onEdit={openEditGoal} onDelete={deleteGoal}
            />
          )}

          {page === "memories" && (
            <MemoriesPage
              t={t} language={language} memories={data.memories}
              onAdd={openNewMemory} onEdit={openEditMemory} onDelete={deleteMemory}
            />
          )}

          {page === "reports" && (
            <ReportsPage t={t} language={language} transactions={data.transactions} />
          )}
        </div>
      </main>

      {modal === "transaction" && form && (
        <Modal
          title={form.id ? t.editTransaction : t.addTransaction}
          onClose={() => setModal(null)}
        >
          <form onSubmit={saveTransaction} className="modal-form">
            <div className="segmented">
              <button
                type="button"
                className={form.type === "income" ? "selected" : ""}
                onClick={() => setForm((p) => ({
                  ...p,
                  type: "income",
                  category: ["Books", "Learning", "Travel", "Food", "Shopping", "Transport", "Beauty", "Bills"].includes(p.category)
                    ? "Lesson" : p.category,
                }))}
              >
                <TrendingUp size={16} /> {t.incomeType}
              </button>
              <button
                type="button"
                className={form.type === "expense" ? "selected" : ""}
                onClick={() => setForm((p) => ({
                  ...p,
                  type: "expense",
                  category: ["Lesson", "Salary", "Pension"].includes(p.category) ? "Other" : p.category,
                }))}
              >
                <TrendingDown size={16} /> {t.expenseType}
              </button>
            </div>

            <Field label={t.title}>
              <input
                autoFocus
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder={t.titlePlaceholder}
                required
              />
            </Field>

            <Field label={t.amount}>
              <AmountInput
                value={form.amount}
                currency={form.currency}
                onAmount={(amount) => setForm((p) => ({ ...p, amount }))}
                onCurrency={(currency) => setForm((p) => ({ ...p, currency }))}
              />
            </Field>

            <div className="form-grid">
              <Field label={t.category}>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {CATEGORY_OPTIONS
                    .filter((x) => form.type === "income"
                      ? ["Salary", "Lesson", "Pension", "Other"].includes(x)
                      : !["Salary", "Lesson", "Pension"].includes(x))
                    .map((x) => (
                      <option value={x} key={x}>{categoryLabel(x, language)}</option>
                    ))}
                </select>
              </Field>
              <Field label={t.date}>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </Field>
            </div>

            <Field label={t.note}>
              <textarea
                rows="3"
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                placeholder={t.notePlaceholder}
              />
            </Field>

            <div className="modal-actions">
              {form.id && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    deleteTransaction(form.id);
                    setModal(null);
                  }}
                >
                  <Trash2 size={16} /> {t.delete}
                </button>
              )}
              <button type="button" className="secondary-button" onClick={() => setModal(null)}>
                {t.cancel}
              </button>
              <button type="submit" className="primary-button">{t.save}</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "goal" && goalForm && (
        <Modal title={goalForm.id ? t.editGoal : t.addGoal} onClose={() => setModal(null)}>
          <form onSubmit={saveGoal} className="modal-form">
            <Field label={t.goalName}>
              <input
                autoFocus
                value={goalForm.name}
                onChange={(e) => setGoalForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={t.goalNamePlaceholder}
                required
              />
            </Field>

            <Field label={t.targetAmount}>
              <AmountInput
                value={goalForm.target}
                currency={goalForm.currency}
                onAmount={(target) => setGoalForm((p) => ({ ...p, target }))}
                onCurrency={(currency) => setGoalForm((p) => ({ ...p, currency }))}
              />
            </Field>

            <Field label={t.savedAmount}>
              <input
                type="number"
                min="0"
                step="any"
                value={goalForm.saved}
                onChange={(e) => setGoalForm((p) => ({ ...p, saved: e.target.value }))}
                placeholder="0"
              />
            </Field>

            <Field label={t.note}>
              <textarea
                rows="3"
                value={goalForm.description}
                onChange={(e) => setGoalForm((p) => ({ ...p, description: e.target.value }))}
                placeholder={t.notePlaceholder}
              />
            </Field>

            <div className="modal-actions">
              {goalForm.id && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    deleteGoal(goalForm.id);
                    setModal(null);
                  }}
                >
                  <Trash2 size={16} /> {t.delete}
                </button>
              )}
              <button type="button" className="secondary-button" onClick={() => setModal(null)}>
                {t.cancel}
              </button>
              <button type="submit" className="primary-button">{t.save}</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "memory" && memoryForm && (
        <Modal title={memoryForm.id ? t.editMemory : t.addMemory} onClose={() => setModal(null)}>
          <form onSubmit={saveMemory} className="modal-form">
            <Field label={t.memoryName}>
              <input
                autoFocus
                value={memoryForm.title}
                onChange={(e) => setMemoryForm((p) => ({ ...p, title: e.target.value }))}
                placeholder={t.memoryNamePlaceholder}
                required
              />
            </Field>

            <Field label={t.memoryAmount}>
              <AmountInput
                value={memoryForm.amount}
                currency={memoryForm.currency}
                onAmount={(amount) => setMemoryForm((p) => ({ ...p, amount }))}
                onCurrency={(currency) => setMemoryForm((p) => ({ ...p, currency }))}
                allowEmpty
              />
            </Field>

            <Field label={t.memoryDate}>
              <input
                type="date"
                value={memoryForm.date}
                onChange={(e) => setMemoryForm((p) => ({ ...p, date: e.target.value }))}
                required
              />
            </Field>

            <Field label={t.memoryNote}>
              <textarea
                rows="4"
                value={memoryForm.note}
                onChange={(e) => setMemoryForm((p) => ({ ...p, note: e.target.value }))}
                placeholder={t.notePlaceholder}
              />
            </Field>

            <div className="modal-actions">
              {memoryForm.id && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    deleteMemory(memoryForm.id);
                    setModal(null);
                  }}
                >
                  <Trash2 size={16} /> {t.delete}
                </button>
              )}
              <button type="button" className="secondary-button" onClick={() => setModal(null)}>
                {t.cancel}
              </button>
              <button type="submit" className="primary-button">{t.save}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function AmountInput({ value, currency, onAmount, onCurrency, allowEmpty = false }) {
  return (
    <div className="amount-field">
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onAmount(e.target.value)}
        placeholder="0"
        required={!allowEmpty}
      />
      <select value={currency} onChange={(e) => onCurrency(e.target.value)}>
        <option value="JPY">JPY ¥</option>
        <option value="USD">USD $</option>
        <option value="TWD">TWD NT$</option>
        <option value="KRW">KRW ₩</option>
      </select>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PageHeading({ title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function SectionHeading({ title, action }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, tone = "" }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-top">
        <span>{label}</span>
        {Icon && <div className="metric-icon"><Icon size={18} /></div>}
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Receipt size={22} /></div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

function TransactionList({ transactions, language, t, onEdit, onDelete, limit }) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (!items.length) {
    return <EmptyState title={t.noTransactions} description={t.noTransactionsHint} />;
  }

  return (
    <div className="transaction-list">
      {items.map((item) => {
        const isIncome = item.type === "income";
        return (
          <div className="transaction-row" key={item.id}>
            <div className={`transaction-icon ${isIncome ? "income" : "expense"}`}>
              {isIncome ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
            </div>
            <div className="transaction-main">
              <strong>{item.title}</strong>
              <span>{categoryLabel(item.category, language)} · {item.date}</span>
              {item.note && <small>{item.note}</small>}
            </div>
            <div className={`transaction-amount ${isIncome ? "positive" : "negative"}`}>
              {isIncome ? "+" : "−"}{formatMoney(item.amount, item.currency, language)}
            </div>
            <div className="transaction-actions">
              <button className="icon-button" onClick={() => onEdit(item)} aria-label={t.edit}>
                <Pencil size={15} />
              </button>
              <button className="icon-button delete-icon" onClick={() => onDelete(item.id)} aria-label={t.delete}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================
   OVERVIEW
   貯金目標をページの最上部に配置
========================================= */

function OverviewPage({
  t, language, monthlyIncome, monthlyExpenses,
  walletBalances, transactions, goals,
  onAdd, onEdit, onDelete,
  onAddGoal, onEditGoal, onDeleteGoal, onGo,
}) {
  const recent = [...transactions].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const totalJPY = walletBalances.JPY || 0;

  return (
    <>
      <PageHeading title={t.overview} description={t.thisMonth} />

      <section className="featured-goals">
        <div className="featured-goals-heading">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> {t.goalOverview}</div>
            <h2>{t.goalsTitle}</h2>
            <p>{t.goalHint}</p>
          </div>
          <button className="primary-button" onClick={onAddGoal}>
            <Plus size={17} /> {t.addGoal}
          </button>
        </div>

        {goals.length ? (
          <div className="featured-goals-grid">
            {goals.map((goal) => {
              const percent = goal.target > 0
                ? Math.min(100, Math.round(goal.saved / goal.target * 100))
                : 0;
              const remaining = Math.max(0, goal.target - goal.saved);

              return (
                <article className="featured-goal-card" key={goal.id}>
                  <div className="featured-goal-top">
                    <div className="featured-goal-symbol"><Target size={20} /></div>
                    <div className="featured-goal-actions">
                      <button className="icon-button" onClick={() => onEditGoal(goal)} aria-label={t.edit}>
                        <Pencil size={15} />
                      </button>
                      <button className="icon-button delete-icon" onClick={() => onDeleteGoal(goal.id)} aria-label={t.delete}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3>{goal.name}</h3>
                  {goal.description && <p className="featured-goal-description">{goal.description}</p>}

                  <div className="featured-goal-progress">
                    <span>{t.progress}</span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="featured-goal-amounts">
                    <div>
                      <small>{t.savedAmount}</small>
                      <strong>{formatMoney(goal.saved, goal.currency, language)}</strong>
                    </div>
                    <div>
                      <small>{t.targetAmount}</small>
                      <strong>{formatMoney(goal.target, goal.currency, language)}</strong>
                    </div>
                  </div>
                  <div className="featured-goal-remaining">
                    {t.remaining} {formatMoney(remaining, goal.currency, language)}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="featured-goals-empty">
            <div className="featured-goals-empty-icon"><PiggyBank size={28} /></div>
            <h3>{t.noGoalOverview}</h3>
            <p>{t.noGoalsHint}</p>
            <button className="secondary-button" onClick={onAddGoal}>
              <Plus size={16} /> {t.addFirstGoal}
            </button>
          </div>
        )}

        <button className="featured-goals-manage" onClick={() => onGo("goals")}>
          {t.goalManage} <ChevronRight size={16} />
        </button>
      </section>

      <div className="summary-grid">
        <MetricCard label={t.totalBalance} value={formatMoney(totalJPY, "JPY", language)} icon={Wallet} />
        <MetricCard label={t.monthlyIncome} value={formatMoney(monthlyIncome, "JPY", language)} icon={TrendingUp} tone="metric-income" />
        <MetricCard label={t.monthlyExpenses} value={formatMoney(monthlyExpenses, "JPY", language)} icon={TrendingDown} tone="metric-expense" />
        <MetricCard label={t.monthlyBalance} value={formatMoney(monthlyIncome - monthlyExpenses, "JPY", language)} icon={PiggyBank} />
      </div>

      <section className="panel overview-transactions-panel">
        <SectionHeading
          title={t.recentTransactions}
          action={<button className="text-button" onClick={() => onGo("income")}>{t.all}</button>}
        />
        <TransactionList
          transactions={recent}
          language={language}
          t={t}
          onEdit={onEdit}
          onDelete={onDelete}
          limit={6}
        />
      </section>
    </>
  );
}

function TransactionsPage({ t, language, page, transactions, search, setSearch, onAdd, onEdit, onDelete }) {
  const isIncome = page === "income";

  return (
    <>
      <PageHeading
        title={isIncome ? t.income : t.expenses}
        description={t.allTransactions}
        action={
          <button className="primary-button" onClick={() => onAdd(isIncome ? "income" : "expense")}>
            <Plus size={17} /> {isIncome ? t.addIncome : t.addExpense}
          </button>
        }
      />

      <div className="search-box">
        <Search size={17} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      <section className="panel">
        <TransactionList
          transactions={transactions}
          language={language}
          t={t}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </section>
    </>
  );
}

function WalletsPage({ t, language, balances, transactions }) {
  const currencies = [
    { code: "JPY", label: t.yen, symbol: "¥" },
    { code: "USD", label: t.usd, symbol: "$" },
    { code: "TWD", label: t.twd, symbol: "NT$" },
    { code: "KRW", label: t.krw, symbol: "₩" },
  ];

  return (
    <>
      <PageHeading title={t.walletsTitle} description={t.walletDescription} />
      <div className="wallet-grid">
        {currencies.map((wallet) => (
          <div className="wallet-card" key={wallet.code}>
            <div className="wallet-card-top">
              <div className="wallet-symbol">{wallet.symbol}</div>
              <span>{wallet.code}</span>
            </div>
            <small>{wallet.label}</small>
            <strong>{formatMoney(balances[wallet.code] || 0, wallet.code, language)}</strong>
            <span className="wallet-count">
              {transactions.filter((x) => x.currency === wallet.code).length} {t.transactionsCount}
            </span>
          </div>
        ))}
      </div>
      <p className="notice-text">{t.walletDescription}</p>
    </>
  );
}

function GoalsPage({ t, language, goals, onAdd, onEdit, onDelete }) {
  return (
    <>
      <PageHeading
        title={t.goalsTitle}
        description={t.noGoalsHint}
        action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> {t.addGoal}</button>}
      />

      {goals.length ? (
        <div className="goals-grid">
          {goals.map((goal) => {
            const percent = goal.target > 0
              ? Math.min(100, Math.round(goal.saved / goal.target * 100))
              : 0;
            const remaining = Math.max(0, goal.target - goal.saved);

            return (
              <article className="goal-card" key={goal.id}>
                <div className="goal-card-header">
                  <div className="goal-icon"><Target size={19} /></div>
                  <div className="goal-card-actions">
                    <button className="icon-button" onClick={() => onEdit(goal)} aria-label={t.edit}>
                      <Pencil size={15} />
                    </button>
                    <button className="icon-button delete-icon" onClick={() => onDelete(goal.id)} aria-label={t.delete}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <h3>{goal.name}</h3>
                {goal.description && <p className="goal-description">{goal.description}</p>}
                <div className="goal-progress-label">
                  <span>{t.progress}</span><strong>{percent}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="goal-amounts">
                  <div><small>{t.savedAmount}</small><strong>{formatMoney(goal.saved, goal.currency, language)}</strong></div>
                  <div><small>{t.targetAmount}</small><strong>{formatMoney(goal.target, goal.currency, language)}</strong></div>
                </div>
                <div className="goal-remaining">
                  {t.remaining} {formatMoney(remaining, goal.currency, language)}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={t.noGoals}
          description={t.noGoalsHint}
          action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> {t.addGoal}</button>}
        />
      )}
    </>
  );
}

function MemoriesPage({ t, language, memories, onAdd, onEdit, onDelete }) {
  const sorted = [...memories].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <>
      <PageHeading
        title={t.memoriesTitle}
        description={t.noMemoriesHint}
        action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> {t.addMemory}</button>}
      />

      {sorted.length ? (
        <div className="memory-list">
          {sorted.map((memory) => (
            <article className="memory-card" key={memory.id}>
              <div className="memory-card-icon"><BookOpen size={19} /></div>
              <div className="memory-card-content">
                <div className="memory-card-top">
                  <h3>{memory.title}</h3>
                  <div className="memory-actions">
                    <button className="icon-button" onClick={() => onEdit(memory)} aria-label={t.edit}>
                      <Pencil size={15} />
                    </button>
                    <button className="icon-button delete-icon" onClick={() => onDelete(memory.id)} aria-label={t.delete}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <span className="memory-date"><CalendarDays size={14} /> {memory.date}</span>
                {memory.note && <p>{memory.note}</p>}
                {safeNumber(memory.amount) > 0 && (
                  <strong className="memory-amount">
                    {formatMoney(memory.amount, memory.currency, language)}
                  </strong>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t.noMemories}
          description={t.noMemoriesHint}
          action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> {t.addMemory}</button>}
        />
      )}
    </>
  );
}

function ReportsPage({ t, language, transactions }) {
  const income = transactions
    .filter((x) => x.type === "income" && x.currency === "JPY")
    .reduce((sum, x) => sum + x.amount, 0);

  const expenses = transactions
    .filter((x) => x.type === "expense" && x.currency === "JPY")
    .reduce((sum, x) => sum + x.amount, 0);

  const categoryTotals = {};
  transactions
    .filter((x) => x.type === "expense" && x.currency === "JPY")
    .forEach((x) => {
      categoryTotals[x.category] = (categoryTotals[x.category] || 0) + x.amount;
    });

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...categories.map((x) => x[1]), 1);

  return (
    <>
      <PageHeading title={t.reportsTitle} description={t.allTransactions} />
      <div className="summary-grid">
        <MetricCard label={t.incomeTotal} value={formatMoney(income, "JPY", language)} icon={TrendingUp} tone="metric-income" />
        <MetricCard label={t.expenseTotal} value={formatMoney(expenses, "JPY", language)} icon={TrendingDown} tone="metric-expense" />
        <MetricCard label={t.balance} value={formatMoney(income - expenses, "JPY", language)} icon={Wallet} />
      </div>

      <section className="panel report-panel">
        <SectionHeading title={t.categoryBreakdown} />
        {categories.length ? (
          <div className="category-report">
            {categories.map(([category, amount]) => (
              <div className="category-report-row" key={category}>
                <div className="category-report-top">
                  <span>{categoryLabel(category, language)}</span>
                  <strong>{formatMoney(amount, "JPY", language)}</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${amount / maxValue * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={t.noReport} />
        )}
      </section>
      <p className="notice-text">{t.walletDescription}</p>
    </>
  );
}
