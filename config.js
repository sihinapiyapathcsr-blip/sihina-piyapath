/* =========================================================
   SIHINA PIYAPATH 2.0 — SITE SETTINGS
   This is the only file you normally need to edit.
   ========================================================= */
window.SITE_CONFIG = {

  /* 1. LIVE BOOK LIST
     Reads the "Book List" tab of the project Google Sheet.
     The sheet must stay shared as "Anyone with the link → Viewer",
     and the tab must stay named exactly "Book List". */
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/16ABR9wuPLF8j2Ehhqz0fntoZc6XRxe9UKD38VpwPSy8/gviz/tq?tqx=out:csv&sheet=Book%20List",

  /* 2. WHATSAPP
     Item-specific "I'll donate this" messages go to this number.
     Format: country code + number, no "+", spaces or leading 0. */
  WHATSAPP_NUMBER: "94740087127",

  /* 3. KEY DATES (YYYY-MM-DD) */
  DROP_OFF_DEADLINE: "2026-10-14",
  DONATION_DAY: "2026-10-30",

  /* Starting list — used only if the live sheet can't be reached.
     [ID, Category, Item, Specification, Unit, Needed, Received] */
  FALLBACK_ITEMS: [
    ["B01","Exercise Books","CR Single Ruled 200 pg","200 pages","books",77,0],
    ["B02","Exercise Books","CR Single Ruled 120 pg","120 pages","books",51,0],
    ["B03","Exercise Books","CR Single Ruled 80 pg","80 pages","books",14,0],
    ["B04","Exercise Books","CR Square Ruled 200 pg","200 pages","books",15,0],
    ["B05","Exercise Books","CR Square Ruled 120 pg","120 pages","books",8,0],
    ["B06","Exercise Books","Single Ruled 160 pg","160 pages","books",4,0],
    ["B07","Exercise Books","Single Ruled 120 pg","120 pages","books",14,0],
    ["B08","Exercise Books","Single Ruled 80 pg","80 pages","books",77,0],
    ["B09","Exercise Books","Square Ruled 160 pg","160 pages","books",25,0],
    ["B10","Exercise Books","Square Ruled 120 pg","120 pages","books",29,0],
    ["B11","Exercise Books","Drawing Book 80 pg","80 pages","books",31,0],
    ["B12","Exercise Books","1/2 Inch Square Ruled 80 pg","80 pages","books",10,0],
    ["B13","Exercise Books","Botany Book 80 pg","80 pages","books",10,0],
    ["B14","Exercise Books","Delisa Book 80 pg","80 pages","books",4,0],
    ["B15","Stationery","Colour Pencils","Box of 12","boxes",26,0],
    ["B16","Stationery","Pastels","Box of 24","boxes",26,0],
    ["B17","Stationery","Pencils","Box of 12","boxes",26,0],
    ["B18","Stationery","Glue","1 bottle","bottles",26,0],
    ["B19","Stationery","Scissors","Small","pieces",26,0],
    ["B20","Stationery","Sharpeners","","pieces",52,0],
    ["B21","Stationery","Rulers","1 foot","pieces",26,0],
    ["B22","Stationery","Erasers","","pieces",52,0],
    ["B23","Uniform Fabric","Girls' Uniform Fabric","2 yd x 14 girls","yards",28,0],
    ["B24","Uniform Fabric","Boys' White Fabric","1.5 yd x 12 boys","yards",18,0],
    ["B25","Uniform Fabric","Boys' Blue Fabric","1 yd x 12 boys","yards",12,0]
  ]
};
