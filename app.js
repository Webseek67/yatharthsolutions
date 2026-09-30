const SHEET_ID = "1VsYHS9eDgl8zPCwW6GYBmL_DFAe9aMoGexUGp8cqWSA";
const SHEET_NAME = "Sheet1";
const NOTIFY_EMAIL = "shreysinghmusic@gmail.com";

function doGet() {
  return ContentService
    .createTextOutput("Yatharth Solutions form is connected.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {

    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet1 was not found.");
    }

    const p = e && e.parameter ? e.parameter : {};

    const timestamp = new Date();

    const name = p.name || "";
    const mobile = p.mobile || "";
    const email = p.email || "";
    const iam = p.iam || "";
    const amount = p.amount || "";
    const goal = p.goal || "";
    const page = p.page || "";

    /*
     * IMPORTANT:
     * The website only allows submission when the consent
     * checkbox is checked.
     *
     * Therefore every successfully submitted lead is recorded
     * as having given consent.
     */
    const consent = "Yes";


    /*
     * Create headers if the sheet is empty.
     */
    if (sheet.getLastRow() === 0) {

      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Mobile Number",
        "Email",
        "I am a...",
        "Investable Amount",
        "Planning For",
        "Consent to Contact",
        "Page"
      ]);

    }


    /*
     * Save lead
     */
    sheet.appendRow([
      timestamp,
      name,
      mobile,
      email,
      iam,
      amount,
      goal,
      consent,
      page
    ]);


    /*
     * Format timestamp
     */
    const row = sheet.getLastRow();

    sheet
      .getRange(row, 1)
      .setNumberFormat("dd-mmm-yyyy hh:mm:ss");


    /*
     * HTML escaping
     */
    function escapeHtml(value) {

      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    const safeName = escapeHtml(name);
    const safeMobile = escapeHtml(mobile);
    const safeEmail = escapeHtml(email);
    const safeIam = escapeHtml(iam);
    const safeAmount = escapeHtml(amount);
    const safeGoal = escapeHtml(goal);
    const safePage = escapeHtml(page);


    const formattedTime = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      "dd MMM yyyy, hh:mm a"
    );


    /*
     * EMAIL SUBJECT
     */
    const subject = "New Website Inquiry – " + name;


    /*
     * HTML EMAIL
     */
    const htmlBody = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

</head>


<body style="
margin:0;
padding:0;
background:#f4f6f8;
font-family:Arial,Helvetica,sans-serif;
color:#1f2937;
">


<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="background:#f4f6f8;padding:30px 15px;">

<tr>

<td align="center">


<table width="620" cellpadding="0" cellspacing="0" border="0"
style="
max-width:620px;
width:100%;
background:#ffffff;
border-radius:10px;
overflow:hidden;
">


<!-- HEADER -->

<tr>

<td style="
background:#0b2745;
padding:28px 30px;
">

<div style="
font-size:24px;
font-weight:bold;
color:#ffffff;
">

Yatharth Solutions

</div>

<div style="
font-size:13px;
color:#cbd5e1;
margin-top:6px;
">

Lead Notification

</div>

</td>

</tr>


<!-- CONTENT -->

<tr>

<td style="padding:30px;">


<div style="
font-size:22px;
font-weight:bold;
color:#0b2745;
margin-bottom:8px;
">

New Website Inquiry Received

</div>


<div style="
font-size:14px;
color:#64748b;
margin-bottom:25px;
">

Someone has submitted an enquiry through the Yatharth Solutions website.

</div>


<!-- DETAILS -->

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
border:1px solid #e5e7eb;
border-radius:8px;
overflow:hidden;
">


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
width:38%;
font-weight:bold;
font-size:13px;
">

Submission Time

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${escapeHtml(formattedTime)}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Full Name

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeName}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Mobile Number

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeMobile}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Email

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeEmail}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Client Profile

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeIam}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Investable Amount

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeAmount}

</td>

</tr>


<tr>

<td style="
padding:13px 15px;
background:#f8fafc;
font-weight:bold;
font-size:13px;
">

Planning Goal

</td>

<td style="
padding:13px 15px;
font-size:13px;
">

${safeGoal}

</td>

</tr>


<!-- CONSENT -->

<tr>

<td style="
padding:15px;
background:#eaf7f3;
font-weight:bold;
font-size:13px;
color:#146356;
border-top:2px solid #146356;
">

CONSENT TO CONTACT

</td>

<td style="
padding:15px;
background:#eaf7f3;
font-size:14px;
font-weight:bold;
color:#146356;
border-top:2px solid #146356;
">

YES — CONTACT PERMITTED

</td>

</tr>


</table>


<!-- CALL BUTTON -->

<div style="
text-align:center;
margin:28px 0 10px;
">

<a
href="tel:${safeMobile}"
style="
display:inline-block;
background:#146356;
color:#ffffff;
text-decoration:none;
padding:13px 25px;
border-radius:6px;
font-size:14px;
font-weight:bold;
">

Call ${safeName} Now

</a>

</div>


<!-- SOURCE -->

<div style="
margin-top:25px;
padding-top:20px;
border-top:1px solid #e5e7eb;
font-size:12px;
color:#94a3b8;
">

<strong>Source:</strong> Website contact form

<br>

<strong>Page:</strong> ${safePage}

</div>


</td>

</tr>


<!-- FOOTER -->

<tr>

<td style="
background:#f8fafc;
padding:18px 30px;
text-align:center;
font-size:11px;
color:#94a3b8;
">

This notification was generated automatically by the Yatharth Solutions website.

</td>

</tr>


</table>

</td>

</tr>

</table>


</body>

</html>
`;


    /*
     * PLAIN TEXT EMAIL
     */
    const plainBody =
      "NEW WEBSITE INQUIRY\n\n" +
      "Submission Time: " + formattedTime + "\n" +
      "Full Name: " + name + "\n" +
      "Mobile Number: " + mobile + "\n" +
      "Email: " + email + "\n" +
      "Client Profile: " + iam + "\n" +
      "Investable Amount: " + amount + "\n" +
      "Planning Goal: " + goal + "\n" +
      "CONSENT TO CONTACT: YES — CONTACT PERMITTED\n" +
      "Page: " + page;


    /*
     * SEND EMAIL
     */
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });


    /*
     * SUCCESS
     */
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true
        })
      )
      .setMimeType(ContentService.MimeType.JSON);


  } catch (error) {

    console.error(error);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: error.toString()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  }
}
