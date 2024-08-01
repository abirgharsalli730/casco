import React from 'react';
import '../styles/Help.css'; 
import signupImage from '../assets/signup.png';
import signinImage from '../assets/signin.png';
import updateImage from '../assets/update.png';
import ProjectCreationImage from '../assets/ProjectCreation.png';
import ImportImage from '../assets/Import.png';
import DesktopImage from '../assets/Desktop.png';
import JiraImage from '../assets/Jira.png';
import Contact from '../components/Contact.jsx'
import token from '../assets/token.png'

const Help = () => {
  return (
    <div
      className="d-flex flex-column align-items-center vh-100 help-container"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
    

      <div className="help-content">
        <section className="help-section">
        <h1 className="uppercase text-xl mb-4 font-bold">How to Use Our Application ?</h1>
          <h2 className=" text-xl mb-4 font-bold">Getting Started</h2>
          <p>To get started with our application, you first need to create an account. Click on the 'Sign Up' button on the top right corner of the homepage and fill in the required details.</p>
          <img src={signupImage} alt="Sign Up" className="help-image"/>
        </section>
        <section className="help-section">
          
          <p>Once you have created an account, an administrator will approve you and set you a role so that you can sign in.</p>
          <img src={signinImage} alt="Sign In" className="help-image"/>
        </section>

      
        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Profile Management</h2>
          <p>To manage your profile, go to the 'Profile' section in the navigation menu. Here you can update your personal information, change your password, and uplod.</p>
          <img src={updateImage} alt="Profile Management" className="help-image"/>
        </section>
      
        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Creating a Project</h2>
            <p>Navigate to the 'Projects' section in the main menu, Enter the project name and description in the provided fields, Click on the 'Create Project' button.</p>
          <img src={ProjectCreationImage} alt="Creating a Project" className="help-image"/>
        </section>

        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Importing Files </h2>
          <p>Choose to import files for your project either from your desktop or by connecting to Jira.</p>
          <img src={ImportImage} alt="Profile Management" className="help-image"/>
        </section>
        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Desktop Files </h2>
          <p>Select an option and upload the document from your desktop.</p>
          <img src={DesktopImage} alt="Profile Management" className="help-image"/>
        </section>
        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Jira Issues</h2>
          <p>To import issues from Jira, you need first to connect to your account.</p>
          <img src={JiraImage} alt="Profile Management" className="help-image"/>       
        </section>
        <section className="help-section">
          <h2 className=" text-xl mb-4 font-bold">Generate a Token</h2>
          <p>To be able to connect, you need to generate a token in order to use it as a password.</p>
          <img src={token} alt="Profile Management" className="help-image"/>       
        </section>
        <section className="help-section">    
          <h2 className=" text-xl mb-4 font-bold">Support</h2>
          <p>If you need any help, you can contact us via this form.</p>
          <Contact/>
          
        </section>
     
      </div>
    </div>
  );
};

export default Help;
