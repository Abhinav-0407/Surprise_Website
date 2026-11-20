const RECIPIENT_EMAIL = "abhinavyadav4070@gmail.com";

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const score = Number(data.score || 0);
    const scoreOutOf = Number(data.scoreOutOf || 9);
    const submitted = data.submittedAt ? new Date(data.submittedAt) : new Date();
    const timezone = Session.getScriptTimeZone() || "Asia/Kolkata";
    const formattedTime = Utilities.formatDate(submitted, timezone, "dd MMM yyyy, hh:mm:ss a");

    const lines = [
      "Birthday Quiz submission",
      "",
      "Score: " + score + " / " + scoreOutOf,
      "Submitted: " + formattedTime,
      "",
      "ALL ANSWERS",
      "============"
    ];

    answers.forEach(function(item) {
      lines.push("Q" + item.number + " — " + item.question);
      lines.push("Selected answer: " + (item.selectedAnswer || "Not answered"));
      if (item.personalResponse) {
        lines.push("Personal response: no right or wrong answer");
      } else {
        lines.push("Correct answer: " + (item.correctAnswer || "Not available"));
        lines.push("Result: " + (item.isCorrect ? "Correct" : "Incorrect"));
      }
      lines.push("");
    });

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: "Birthday Quiz — Zebaa's answers (" + score + "/" + scoreOutOf + ")",
      body: lines.join("\n")
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
