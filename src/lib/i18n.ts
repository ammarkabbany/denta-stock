// i18n utilities for Arabic/English support with RTL

export type Language = 'ar' | 'en'

export const DEFAULT_LANGUAGE: Language = 'ar'

export const translations = {
  ar: {
    // App
    appName: 'DentaStock',
    appTagline: 'نظام إدارة مخزون معامل الأسنان',

    // Navigation
    nav: {
      dashboard: 'لوحة التحكم',
      inventory: 'المخزون',
      movements: 'الحركات',
      reports: 'التقارير',
      settings: 'الإعدادات',
    },

    // Dashboard
    dashboard: {
      title: 'لوحة التحكم',
      welcome: 'مرحباً',
      totalItems: 'إجمالي الأصناف',
      lowStock: 'مخزون منخفض',
      outOfStock: 'نفذ من المخزون',
      totalValue: 'القيمة الإجمالية',
      recentMovements: 'آخر الحركات',
      lowStockAlerts: 'تنبيهات المخزون المنخفض',
      quickActions: 'إجراءات سريعة',
      noAlerts: 'لا توجد تنبيهات',
      noMovements: 'لا توجد حركات حديثة',
      viewAll: 'عرض الكل',
    },

    // Inventory
    inventory: {
      title: 'المخزون',
      addItem: 'إضافة صنف',
      editItem: 'تعديل صنف',
      deleteItem: 'حذف صنف',
      archiveItem: 'أرشفة صنف',
      archiveConfirm: 'هل أنت متأكد من أرشفة',
      archiveDescription:
        'سيتم إخفاء الصنف من القوائم ولكن ستبقى حركاته محفوظة.',
      searchPlaceholder: 'البحث في المخزون...',
      noItems: 'لا توجد أصناف',
      name: 'الاسم',
      sku: 'رمز الصنف',
      category: 'الفئة',
      unit: 'الوحدة',
      currentStock: 'المخزون الحالي',
      lowStockThreshold: 'حد المخزون المنخفض',
      costPerUnit: 'التكلفة للوحدة',
      location: 'الموقع',
      notes: 'ملاحظات',
      description: 'الوصف',
      allCategories: 'جميع الفئات',
      allStatuses: 'جميع الحالات',
      inStock: 'متوفر',
      lowStockStatus: 'منخفض',
      outOfStockStatus: 'نفذ',
    },

    // Stock Movements
    movements: {
      title: 'حركات المخزون',
      stockIn: 'إدخال مخزون',
      stockOut: 'إخراج مخزون',
      adjust: 'تعديل',
      type: 'النوع',
      quantity: 'الكمية',
      reason: 'السبب',
      date: 'التاريخ',
      by: 'بواسطة',
      previousStock: 'المخزون السابق',
      newStock: 'المخزون الجديد',
      addMovement: 'إضافة حركة',
      in: 'إدخال',
      out: 'إخراج',
    },

    // Categories
    categories: {
      title: 'الفئات',
      addCategory: 'إضافة فئة',
      editCategory: 'تعديل فئة',
      deleteCategory: 'حذف فئة',
      name: 'اسم الفئة',
      nameAr: 'الاسم بالعربية',
      itemCount: 'عدد الأصناف',
      cannotDelete: 'لا يمكن حذف الفئة لوجود أصناف مرتبطة بها',
    },

    // Units
    units: {
      title: 'الوحدات',
      addUnit: 'إضافة وحدة',
      editUnit: 'تعديل وحدة',
      deleteUnit: 'حذف وحدة',
      name: 'اسم الوحدة',
      nameAr: 'الاسم بالعربية',
      abbreviation: 'الاختصار',
      abbreviationAr: 'الاختصار بالعربية',
      cannotDelete: 'لا يمكن حذف الوحدة لوجود أصناف مرتبطة بها',
    },

    // Settings
    settings: {
      title: 'الإعدادات',
      general: 'عام',
      team: 'الفريق',
      language: 'اللغة',
      currency: 'العملة',
      theme: 'المظهر',
      light: 'فاتح',
      dark: 'داكن',
      system: 'تلقائي',
      notifications: 'الإشعارات',
      lowStockAlerts: 'تنبيهات المخزون المنخفض',
      emailNotifications: 'إشعارات البريد الإلكتروني',
      categoriesAndUnits: 'الفئات والوحدات',
      manageCategories: 'إدارة الفئات',
      manageUnits: 'إدارة الوحدات',
      noCategories: 'لا توجد فئات',
      noUnits: 'لا توجد وحدات',
      addFirst: 'أضف أول',
    },

    // Reports
    reports: {
      title: 'التقارير',
      overview: 'نظرة عامة',
      stockAnalysis: 'تحليل المخزون',
      movementTrends: 'اتجاهات الحركة',
      topItems: 'الأصناف الأكثر حركة',
      lowStockReport: 'تقرير المخزون المنخفض',
      period: 'الفترة',
      last7Days: 'آخر 7 أيام',
      last30Days: 'آخر 30 يوم',
      last90Days: 'آخر 90 يوم',
      allTime: 'كل الوقت',
      totalMovements: 'إجمالي الحركات',
      stockIn: 'إدخال',
      stockOut: 'إخراج',
      adjustments: 'تعديلات',
      valueByCategory: 'القيمة حسب الفئة',
      stockByCategory: 'المخزون حسب الفئة',
      itemsCount: 'عدد الأصناف',
      totalStock: 'إجمالي المخزون',
      totalValue: 'القيمة الإجمالية',
      deficit: 'العجز',
      noData: 'لا توجد بيانات',
      exportReport: 'تصدير التقرير',
    },

    // Common
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      confirm: 'تأكيد',
      yes: 'نعم',
      no: 'لا',
      close: 'إغلاق',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      all: 'الكل',
      none: 'لا شيء',
      optional: 'اختياري',
      required: 'مطلوب',
      actions: 'إجراءات',
      status: 'الحالة',
      active: 'نشط',
      archived: 'مؤرشف',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ التحديث',
    },

    // Auth
    auth: {
      signIn: 'تسجيل الدخول',
      signInDescription: 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك',
      signingIn: 'جاري تسجيل الدخول...',
      signUp: 'إنشاء حساب',
      signingUp: 'جاري إنشاء الحساب...',
      signOut: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم',
      enterPassword: 'أدخل كلمة المرور',
      enterName: 'أدخل اسمك',
      forgotPassword: 'نسيت كلمة المرور؟',
      invalidCredentials: 'بيانات الدخول غير صحيحة',
      preparingWorkspace: 'جاري تجهيز مساحة العمل...',
    },

    // Errors
    errors: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      minLength: 'الحد الأدنى للأحرف هو {min}',
      maxLength: 'الحد الأقصى للأحرف هو {max}',
      negativeStock: 'لا يمكن أن يكون المخزون سالباً',
      insufficientStock: 'المخزون غير كافٍ',
      itemNotFound: 'الصنف غير موجود',
      unauthorized: 'غير مصرح لك بهذا الإجراء',
      networkError: 'خطأ في الاتصال',
    },

    // PWA
    pwa: {
      installTitle: 'تثبيت التطبيق',
      installDescription:
        'ثبّت DentaStock على جهازك للوصول السريع والعمل بدون إنترنت.',
      installButton: 'تثبيت',
      notNow: 'ليس الآن',
    },

    // Billing
    billing: {
      trialExpiredTitle: 'انتهت الفترة التجريبية',
      trialExpiredOn: 'انتهت في {{date}}',
      trialExpiredGeneric: 'انتهت الفترة التجريبية',
      trialEndingTitle: 'الفترة التجريبية على وشك الانتهاء',
      trialEndingOn: 'تنتهي في {{date}}',
      trialEndingGeneric: 'الفترة التجريبية تنتهي قريباً',
      planExpiredTitle: 'انتهى اشتراكك',
      planExpiredOn: 'انتهى في {{date}}',
      planExpiredGeneric: 'انتهى الاشتراك',
      planEndingTitle: 'اشتراكك على وشك الانتهاء',
      planEndingOn: 'ينتهي في {{date}}',
      planEndingGeneric: 'الاشتراك ينتهي قريباً',
      subscriptionExpired: 'انتهى الاشتراك',
      subscriptionExpiredMessage:
        'انتهى اشتراكك. يرجى التجديد للاستمرار في استخدام التطبيق.',
      featureNotAvailable: 'الميزة غير متاحة',
      featureNotAvailableMessage:
        'ميزة إدارة المخزون غير مضمنة في خطتك الحالية.',
      featureDisabled: 'الميزة معطلة',
      featureDisabledMessage: 'تم تعطيل ميزة إدارة المخزون مؤقتاً.',
      upgradePlan: 'يرجى ترقية خطتك للوصول إلى هذه الميزة.',
      contactAdmin: 'يرجى التواصل مع المسؤول لمزيد من المعلومات.',
    },

    // Default categories
    defaultCategories: {
      cadcam: 'كتل CAD/CAM',
      millingTools: 'أدوات التفريز',
      ceramics: 'السيراميك',
      polishing: 'التلميع',
      impressionMaterials: 'مواد الطبعات',
      packaging: 'التغليف',
      officeSupplies: 'مستلزمات المكتب',
      other: 'أخرى',
    },

    // Default units
    defaultUnits: {
      pcs: 'قطعة',
      box: 'علبة',
      set: 'طقم',
      pack: 'عبوة',
      ml: 'مل',
      g: 'جرام',
      roll: 'لفة',
      sheet: 'ورقة',
    },
  },
  en: {
    // App
    appName: 'DentaStock',
    appTagline: 'Dental Lab Inventory Management System',

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      movements: 'Movements',
      reports: 'Reports',
      settings: 'Settings',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      totalItems: 'Total Items',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      totalValue: 'Total Value',
      recentMovements: 'Recent Movements',
      lowStockAlerts: 'Low Stock Alerts',
      quickActions: 'Quick Actions',
      noAlerts: 'No alerts',
      noMovements: 'No recent movements',
      viewAll: 'View All',
    },

    // Inventory
    inventory: {
      title: 'Inventory',
      addItem: 'Add Item',
      editItem: 'Edit Item',
      deleteItem: 'Delete Item',
      archiveItem: 'Archive Item',
      archiveConfirm: 'Are you sure you want to archive',
      archiveDescription:
        'The item will be hidden from lists but its movements will be preserved.',
      searchPlaceholder: 'Search inventory...',
      noItems: 'No items found',
      name: 'Name',
      sku: 'SKU',
      category: 'Category',
      unit: 'Unit',
      currentStock: 'Current Stock',
      lowStockThreshold: 'Low Stock Threshold',
      costPerUnit: 'Cost per Unit',
      location: 'Location',
      notes: 'Notes',
      description: 'Description',
      allCategories: 'All Categories',
      allStatuses: 'All Statuses',
      inStock: 'In Stock',
      lowStockStatus: 'Low',
      outOfStockStatus: 'Out',
    },

    // Stock Movements
    movements: {
      title: 'Stock Movements',
      stockIn: 'Stock In',
      stockOut: 'Stock Out',
      adjust: 'Adjust',
      type: 'Type',
      quantity: 'Quantity',
      reason: 'Reason',
      date: 'Date',
      by: 'By',
      previousStock: 'Previous Stock',
      newStock: 'New Stock',
      addMovement: 'Add Movement',
      in: 'In',
      out: 'Out',
    },

    // Categories
    categories: {
      title: 'Categories',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      deleteCategory: 'Delete Category',
      name: 'Category Name',
      nameAr: 'Arabic Name',
      itemCount: 'Item Count',
      cannotDelete: 'Cannot delete category with associated items',
    },

    // Units
    units: {
      title: 'Units',
      addUnit: 'Add Unit',
      editUnit: 'Edit Unit',
      deleteUnit: 'Delete Unit',
      name: 'Unit Name',
      nameAr: 'Arabic Name',
      abbreviation: 'Abbreviation',
      abbreviationAr: 'Arabic Abbreviation',
      cannotDelete: 'Cannot delete unit with associated items',
    },

    // Settings
    settings: {
      title: 'Settings',
      general: 'General',
      team: 'Team',
      language: 'Language',
      currency: 'Currency',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      notifications: 'Notifications',
      lowStockAlerts: 'Low Stock Alerts',
      emailNotifications: 'Email Notifications',
      categoriesAndUnits: 'Categories & Units',
      manageCategories: 'Manage Categories',
      manageUnits: 'Manage Units',
      noCategories: 'No categories',
      noUnits: 'No units',
      addFirst: 'Add first',
    },

    // Reports
    reports: {
      title: 'Reports',
      overview: 'Overview',
      stockAnalysis: 'Stock Analysis',
      movementTrends: 'Movement Trends',
      topItems: 'Top Items',
      lowStockReport: 'Low Stock Report',
      period: 'Period',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      allTime: 'All Time',
      totalMovements: 'Total Movements',
      stockIn: 'Stock In',
      stockOut: 'Stock Out',
      adjustments: 'Adjustments',
      valueByCategory: 'Value by Category',
      stockByCategory: 'Stock by Category',
      itemsCount: 'Items Count',
      totalStock: 'Total Stock',
      totalValue: 'Total Value',
      deficit: 'Deficit',
      noData: 'No data',
      exportReport: 'Export Report',
    },

    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      all: 'All',
      none: 'None',
      optional: 'Optional',
      required: 'Required',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      archived: 'Archived',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
    },

    // Auth
    auth: {
      signIn: 'Sign In',
      signInDescription: 'Enter your email and password to access your account',
      signingIn: 'Signing in...',
      signUp: 'Sign Up',
      signingUp: 'Signing up...',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      enterPassword: 'Enter your password',
      enterName: 'Enter your name',
      forgotPassword: 'Forgot Password?',
      invalidCredentials: 'Invalid credentials',
      preparingWorkspace: 'Preparing workspace...',
    },

    // Errors
    errors: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      minLength: 'Minimum {min} characters required',
      maxLength: 'Maximum {max} characters allowed',
      negativeStock: 'Stock cannot be negative',
      insufficientStock: 'Insufficient stock',
      itemNotFound: 'Item not found',
      unauthorized: 'Unauthorized action',
      networkError: 'Network error',
    },

    // PWA
    pwa: {
      installTitle: 'Install App',
      installDescription:
        'Install DentaStock on your device for quick access and offline work.',
      installButton: 'Install',
      notNow: 'Not now',
    },

    // Billing
    billing: {
      trialExpiredTitle: 'Your trial has ended',
      trialExpiredOn: 'Ended on {{date}}',
      trialExpiredGeneric: 'Trial period has ended',
      trialEndingTitle: 'Your trial is ending soon',
      trialEndingOn: 'Ends on {{date}}',
      trialEndingGeneric: 'Trial period ends soon',
      planExpiredTitle: 'Your subscription has ended',
      planExpiredOn: 'Ended on {{date}}',
      planExpiredGeneric: 'Subscription has ended',
      planEndingTitle: 'Your plan is ending soon',
      planEndingOn: 'Ends on {{date}}',
      planEndingGeneric: 'Subscription ends soon',
      subscriptionExpired: 'Subscription Expired',
      subscriptionExpiredMessage:
        'Your subscription has expired. Please renew to continue using the application.',
      featureNotAvailable: 'Feature Not Available',
      featureNotAvailableMessage:
        'The inventory management feature is not included in your current plan.',
      featureDisabled: 'Feature Disabled',
      featureDisabledMessage:
        'The inventory management feature has been temporarily disabled.',
      upgradePlan: 'Please upgrade your plan to access this feature.',
      contactAdmin: 'Please contact your administrator for more information.',
    },

    // Default categories
    defaultCategories: {
      cadcam: 'CAD/CAM Blocks',
      millingTools: 'Milling Tools',
      ceramics: 'Ceramics',
      polishing: 'Polishing',
      impressionMaterials: 'Impression Materials',
      packaging: 'Packaging',
      officeSupplies: 'Office Supplies',
      other: 'Other',
    },

    // Default units
    defaultUnits: {
      pcs: 'Pieces',
      box: 'Box',
      set: 'Set',
      pack: 'Pack',
      ml: 'ml',
      g: 'g',
      roll: 'Roll',
      sheet: 'Sheet',
    },
  },
} as const

export type TranslationKey = keyof typeof translations.ar

export function getTranslations(lang: Language) {
  return translations[lang]
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar'
}

export function getDirection(lang: Language): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr'
}

// Format number with locale - always use Western numerals
export function formatNumber(num: number): string {
  // Always use en-US for Western numerals regardless of language
  return new Intl.NumberFormat('en-US').format(num)
}

// Format date with locale
export function formatDate(
  date: Date | string | number,
  lang: Language,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US'
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat(
    locale,
    options ?? {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  ).format(dateObj)
}

// Format relative time
export function formatRelativeTime(
  date: Date | string | number,
  lang: Language,
): string {
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US'
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffDays > 0) return rtf.format(-diffDays, 'day')
  if (diffHours > 0) return rtf.format(-diffHours, 'hour')
  if (diffMins > 0) return rtf.format(-diffMins, 'minute')
  return rtf.format(-diffSecs, 'second')
}
