document.getElementById('submited').addEventListener('submit',(e)=>{
    console.log("Called")
    e.preventDefault()
    alert("Thank you for reaching out to us! Our team will get back to you shortly.")
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("message").value = ""
})