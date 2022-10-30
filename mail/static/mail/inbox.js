document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  //submit
  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#details-view').style.display = 'none';

  // Clear out composition fields 
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    
    document.querySelector(`#emails-view`).style.display = 'none';
    document.querySelector(`#compose-view`).style.display = 'none';
    document.querySelector(`#details-view`).style.display = 'block';

    document.querySelector(`#details-view`).innerHTML = `
      <strong>From: </strong>${email.sender}<br>
      <strong>To: </strong>${email.recipients}<br>
      <strong>Subject: </strong>${email.subject}<br>
      <strong>Timestamp: </strong>${email.timestamp}<br>
    <br><hr>
      ${email.body}
      `

    // Change to read
    if(!email.read){
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body:JSON.stringify({
          read:true
        })
      })
    }
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#details-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

//Get emails for mailbox and user
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
  //loop through emails and create a div for each 
  emails.forEach(singleEmail => {

    //Create div for each email
    const newEmail = document.createElement('div');
    newEmail.className = "list-group-item";
    newEmail.innerHTML = `
      <h5>Sender: ${singleEmail.sender}</h5>
      <h5>Subject: ${singleEmail.subject}</h5>
      <p>${singleEmail.timestamp}</p>
    `;

    //Toggle read or not
    newEmail.className = singleEmail.read ? 'read' : 'undread';
    //add click event to view email
    newEmail.addEventListener('click', function() {
      view_email(singleEmail.id)
    }); 
document.querySelector('#emails-view').append(newEmail);
  })
});
}


function send_email(event) {
  event.preventDefault();

  //store fields
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //send data to backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });

}

function send_email(event){

}

