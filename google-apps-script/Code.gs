// ═══════════════════════════════════════════════════════════════
//  Crystal People — Google Apps Script Backend
//  Handles both Users and Reviews sheets
// ═══════════════════════════════════════════════════════════════

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // ← Replace this

const REVIEW_COLUMNS = [
  "id", "employeeId", "employeeName", "month", "year",
  "outputQuality", "attendance", "teamwork", "comment",
  "managerId", "managerName", "timestamp",
];

const USER_COLUMNS = [
  "id", "name", "email", "password", "role",
  "department", "initials", "avatar", "managerId", "createdAt",
];

// ── Sheet helpers ────────────────────────────────────────────────

function getReviewSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Reviews");
  if (!sheet) {
    sheet = ss.insertSheet("Reviews");
    sheet.appendRow(REVIEW_COLUMNS);
    styleHeader(sheet, REVIEW_COLUMNS.length);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getUserSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Users");
  if (!sheet) {
    sheet = ss.insertSheet("Users");
    sheet.appendRow(USER_COLUMNS);
    styleHeader(sheet, USER_COLUMNS.length);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function styleHeader(sheet, numCols) {
  sheet.getRange(1, 1, 1, numCols)
    .setFontWeight("bold")
    .setBackground("#4f46e5")
    .setFontColor("#ffffff");
}

function sheetToObjects(sheet, columns) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map((row) => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// ── GET handler ──────────────────────────────────────────────────

function doGet(e) {
  const action = e.parameter.action || "";

  if (action === "getReviews") {
    try {
      const reviews = sheetToObjects(getReviewSheet(), REVIEW_COLUMNS).map((r) => ({
        ...r,
        outputQuality: Number(r.outputQuality),
        attendance: Number(r.attendance),
        teamwork: Number(r.teamwork),
        year: Number(r.year),
      }));
      return jsonResponse({ success: true, data: reviews });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message });
    }
  }

  if (action === "getUsers") {
    try {
      const users = sheetToObjects(getUserSheet(), USER_COLUMNS);
      return jsonResponse({ success: true, data: users });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message });
    }
  }

  if (action === "checkEmail") {
    try {
      const email = e.parameter.email || "";
      const users = sheetToObjects(getUserSheet(), USER_COLUMNS);
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      return jsonResponse({ success: true, exists });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message });
    }
  }

  return jsonResponse({ success: false, error: "Unknown action: " + action });
}

// ── POST handler ─────────────────────────────────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || "";

    if (action === "submitReview") {
      const review = body.review;
      const sheet = getReviewSheet();
      const data = sheet.getDataRange().getValues();
      let updated = false;
      if (data.length > 1) {
        const empIdx   = REVIEW_COLUMNS.indexOf("employeeId");
        const monthIdx = REVIEW_COLUMNS.indexOf("month");
        const yearIdx  = REVIEW_COLUMNS.indexOf("year");
        for (let i = 1; i < data.length; i++) {
          if (
            data[i][empIdx] === review.employeeId &&
            data[i][monthIdx] === review.month &&
            Number(data[i][yearIdx]) === Number(review.year)
          ) {
            sheet.getRange(i + 1, 1, 1, REVIEW_COLUMNS.length)
              .setValues([REVIEW_COLUMNS.map((c) => review[c] ?? "")]);
            updated = true;
            break;
          }
        }
      }
      if (!updated) {
        sheet.appendRow(REVIEW_COLUMNS.map((c) => review[c] ?? ""));
      }
      return jsonResponse({ success: true, data: review });
    }

    if (action === "addUser") {
      const user = body.user;
      const sheet = getUserSheet();
      const existing = sheetToObjects(sheet, USER_COLUMNS);
      if (existing.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
        return jsonResponse({ success: false, error: "Email already exists" });
      }
      sheet.appendRow(USER_COLUMNS.map((c) => user[c] ?? ""));
      return jsonResponse({ success: true, data: user });
    }

    if (action === "deleteUser") {
      const userId = body.userId;
      const sheet = getUserSheet();
      const data = sheet.getDataRange().getValues();
      const idIdx = USER_COLUMNS.indexOf("id");
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIdx] === userId) {
          sheet.deleteRow(i + 1);
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "User not found" });
    }

    if (action === "updatePassword") {
      const { userId, newPassword } = body;
      const sheet = getUserSheet();
      const data = sheet.getDataRange().getValues();
      const idIdx = USER_COLUMNS.indexOf("id");
      const pwIdx = USER_COLUMNS.indexOf("password");
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIdx] === userId) {
          sheet.getRange(i + 1, pwIdx + 1).setValue(newPassword);
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "User not found" });
    }

    return jsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
