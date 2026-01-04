
    const dobInput = document.getElementById("dob");
    const dobError = document.getElementById("dobError");
    const form = document.getElementById("regForm");
    const mobno = document.getElementById("mobileno");
    const mobError = document.getElementById("mobError");


    // Block future dates
    const today = new Date().toISOString().split("T")[0];
    dobInput.max = today;

    form.addEventListener("submit", function (e) {
      const dob = new Date(dobInput.value);
      const todayDate = new Date();

      let age = todayDate.getFullYear() - dob.getFullYear();
      const monthDiff = todayDate.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && todayDate.getDate() < dob.getDate())
      ) {
        age--;
      }

      if (age < 10) {
        e.preventDefault();
        dobError.textContent = "Age must be at least 10 years.";
      } else {
        dobError.textContent = "";
      }

      if (!mobno.isInteger){
         e.preventDefault();
        mobError.textContent = "Mobile number must be integer";
      } else {
        mobError.textContent = "";
      }
    });
