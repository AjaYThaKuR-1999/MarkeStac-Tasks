function generateHTML(adminName, clinicName) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Agreement</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.5; margin: 40px; }
          h1 { text-align: center; }
          p { margin-bottom: 1em; }
          .signature { margin-top: 60px; }
          .sign-line { display: inline-block; width: 250px; border-bottom: 1px solid #000; }
          .role { font-size: 0.9em; color: #555; }
        </style>
      </head>
      <body>
        <h1>Clinic Administration Agreement</h1>
        <p>This agreement (“Agreement”) is made between:</p>
  
        <p><strong>Administrator:</strong> ${adminName}</p>
        <p><strong>Clinic:</strong> ${clinicName}</p>
  
        <p>
          Administrator agrees to oversee and manage the day-to-day operations of the Clinic,
          ensuring compliance with all applicable regulations and policies.
        </p>
  
        <p>
          The Clinic agrees to provide all necessary access, resources, and support for the
          Administrator to perform their duties effectively.
        </p>
  
        <p>This Agreement is effective as of the date of the last signature below.</p>
  
        <div class="signature">
          <div>
            <span class="sign-line"></span><br/>
            <span class="role">Administrator Signature</span><br/>
            <span>${adminName}</span>
          </div>
          <div style="margin-top: 40px;">
            <span class="sign-line"></span><br/>
            <span class="role">Clinic Representative Signature</span><br/>
            <span>${clinicName}</span>
          </div>
        </div>
      </body>
    </html>
    `;
}

module.exports = { generateHTML };
  