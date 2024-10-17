<h1 align="center" id="title">SafeReturns</h1>

<p id="description">SafeReturns is a web application designed to help reunite missing persons with their families or organizations through age-based facial recognition technology. It allows users to create reports, track missing or found persons, and receive notifications when a potential match is found.</p>

<h2>🧐 Features</h2>

Here are some of the project's best features:

*   **Age-Based Facial Recognition**: Uses CNN (DeepFace) to match photos of individuals with consideration of age differences.
*   **User Authentication**: Users can create accounts with secure session-based authentication and authorization.
*   **Report Submission & Tracking**: Users can submit and track reports for missing or found persons with detailed information and images.

<h2>🛠️ Installation Steps:</h2>

1. **Navigate to Your Desired Folder in VS Code**  
   ```bash
   cd /path/to/your/folder
   ```

2. **Clone the Repository**  
   ```bash
   git clone https://github.com/CodingSakshi/SafeReturns.git
   ```

3. **Navigate to the Project Directory**  
   ```bash
   cd SafeReturns
   ```

4. **Set Up Python Dependencies**  
   *Option A: Use a Virtual Environment (Recommended)*  
   - Create a virtual environment:
     ```bash
     python -m venv .venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       .venv\Scripts\activate
       ```
     - On MacOS/Linux:
       ```bash
       source .venv/bin/activate
       ```
   - Install the Python dependencies:
     ```bash
     pip install -r requirements.txt  # This may take some time to download
     ```

   *Option B: Install Globally*  
   ```bash
   pip install -r requirements.txt
   ```
   ⚠️ **Note:** Installing globally is less safe due to potential version conflicts with other projects.

5. **Set Up npm (JavaScript) Dependencies**  
   Ensure Node.js and MongoDB are installed, then run:
   ```bash
   npm install
   ```

6. **Running the Project**  
   ```bash
   npm start
   ```

<h2>🍰 Contribution Guidelines:</h2>

Future Enhancements:
- **Manual Verification**: Once a match is found, users can manually verify if the matched individuals are indeed the same person. This process allows users to confirm or reject matches, reducing false positives and ensuring accuracy in identifying missing persons.
- **SMTP Notifications**: Implement automated email notifications when a potential match is found. This feature can help notify users promptly and keep them informed of any updates regarding their reports.
- **Advanced Filtering**: Enable more precise searches based on additional parameters, such as location, age range, and physical characteristics, to enhance the matching process.
- **Mobile Responsiveness**: Improve the user interface for better accessibility on mobile devices, ensuring a seamless experience for all users.
- **User Feedback System**: Incorporate a feedback mechanism for users to report issues or suggest improvements, fostering community engagement and ongoing development.
- **Improving Database Schema**: Refine and optimize the database schema to enhance performance and scalability. This may include normalizing data, establishing proper indexing, and creating relationships between collections to streamline queries and ensure data integrity

Contributions are welcome! This project is open for collaboration. Please create a pull request or open an issue for any bugs or feature requests. Your contributions can help enhance this project and make it more effective.

<h2>💻 Built with</h2>

Technologies used in the project:

*   **Frontend**: EJS, CSS, JavaScript
*   **Backend**: Node.js, Express.js
*   **Facial Recognition**: DeepFace (CNN Model)
*   **Authentication**: Session-based authentication and authorization
*   **Email Notifications**: SMTP

