/**
 * @license
 * © 2025 Pachara Klangchit. All rights reserved.
 * Script for Dent NU Stock.
 * Do not copy or distribute without permission.
 */
// Spreadsheet ID และชื่อชีท
const SPREADSHEET_ID = '1wFQvFvq3j2phZMfFlqV4SHxjFVOXdpgNZ6e_d1x_e0k';
const SHEET_PRODUCTS = 'EquipmentList';
const SHEET_NAME = 'EquipmentList';


// -------------------- Routing --------------------
function doGet(e) {
  const page = e.parameter.page || 'Index';
  switch (page) {
    case 'Products':
      return HtmlService.createTemplateFromFile('Products')
        .evaluate()
        .setTitle('ระบบจัดการอุปกรณ์')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    case 'Request':
      return HtmlService.createTemplateFromFile('Request')
        .evaluate()
        .setTitle('ระบบเบิกอุปกรณ์')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    case 'Borrow':
      return HtmlService.createTemplateFromFile('Borrow')
        .evaluate()
        .setTitle('ระบบเบิกอุปกรณ์')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    default:
      return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle('หน้าหลัก')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function searchProducts(keyword, availableQuantity) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  const data = sheet.getDataRange().getValues();

  const results = data.filter((row, index) => {
    if (index === 0) return false; // ข้ามหัวตาราง
    const matchName = keyword === '' || row[0].toString().includes(keyword);
    return matchName;
  });

  return results.map(r => ({
    name: r[0],
    TotalQuantity: r[1],
    AvailableQuantity: r[2],
    Status: r[3]
  }));
}




// -------------------- Products --------------------
function getProducts() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues(); // A2:E
  return data.map(row => ({
    Name: row[0],
    TotalQuantity: row[1],
    AvailableQuantity: row[2],
    Status: row[3],
    timestamp: row[4]

  }));
}

function addProduct(product) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  sheet.appendRow([
    Name,
    TotalQuantity,
    AvailableQuantity,
    Status,
        new Date(),

  ]);
}

function updateProduct(rowIndex, product) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  sheet.getRange(rowIndex, 2, 1, 4).setValues([[ // B to E
    Name,
    TotalQuantity,
    AvailableQuantity,
    Status
  ]]);
}

function deleteProduct(rowIndex) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRODUCTS);
  sheet.deleteRow(rowIndex);
}

// -------------------- Requests --------------------
function getRequests() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_REQUESTS);
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues(); // A2:I
  return data.map(row => ({
    timestamp: row[0],
    id: row[1],
    name: row[2],
    quantity: row[3],
    requester: row[4],
    jobPosition: row[5],
    department: row[6],
    approver: row[7],
    purpose: row[8]
  }));
}

function updateRequest(requestId, updatedData) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_REQUESTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === requestId) {
      sheet.getRange(i + 1, 3, 1, 7).setValues([[
        updatedData.name,
        updatedData.quantity,
        updatedData.requester,
        updatedData.jobPosition,
        updatedData.department,
        updatedData.approver,
        updatedData.purpose
      ]]);
      return true;
    }
  }
  return false;
}

function deleteRequest(requestId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_REQUESTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === requestId) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function addRequest(request) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_REQUESTS);
  if (!sheet) throw new Error('ไม่พบชีท Requests');

  const id = Utilities.getUuid().slice(0, 10); // สร้าง ID สั้น ๆ

  sheet.appendRow([
    new Date(),         // timestamp
    id,                 // รหัสคำขอ
    request.name,       // ชื่อสินค้า
    request.quantity,   // จำนวน
    request.requester,  // ผู้ขอเบิก
    request.jobPosition,// ตำแหน่ง
    request.department, // แผนก
    request.approver,   // ผู้อนุมัติ
    request.purpose     // วัตถุประสงค์
  ]);

  return 'OK';
}


