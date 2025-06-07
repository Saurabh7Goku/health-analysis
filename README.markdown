# Health Analysis Web Application

A modern web application built with **Next.js**, **React**, and **Tailwind CSS** that allows users to input personal health details and receive a detailed health analysis, including BMI, BMR, daily calorie needs, and basic health recommendations.

## Features

- **User Input Form**: Collects personal details such as name, age, gender, height, weight, activity level, and optional health conditions.
- **Health Analysis**:
  - Calculates **Body Mass Index (BMI)** with interpretation.
  - Computes **Basal Metabolic Rate (BMR)** using the Mifflin-St Jeor equation.
  - Estimates **daily calorie needs** based on activity level.
  - Provides **basic health recommendations** tailored to age, BMI, and activity level.
- **Form Validation**: Ensures all required fields are filled with valid data before submission.
- **Dynamic Results**: Displays results instantly without page reload using Next.js API routes.
- **Responsive Design**: Styled with Tailwind CSS for a clean, modern, and mobile-first approach.

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Next.js (via Next.js API routes)
- **Language**: JavaScript (ES6+)
- **Tools**: Node.js, ESLint, PostCSS, Autoprefix

## Prerequisites

- **Node.js**: Version 18.x or later
- **npm**: Version 7.x or later

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-name/health-analysis.git
   cd health-analysis
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Fill Out the Form**:
   - Enter your name, age, gender, height (cm), weight (kg), and select an activity level (Sedentary, Lightly Active, Moderately Active, Very Active).
   - Optionally, provide any known health conditions in the text area.

2. **Submit the Form**:
   - Click the "Calculate" button to submit your details.
   - If there are validation errors, they will be displayed below the respective fields.

3. **View Results**:
   - Upon successful submission, the app will display your BMI, BMR, daily calorie needs, and health recommendations below the form.

## Project Structure

```
health-analysis-app/
├── components/              # React components
│   ├── HealthForm.jsx       # Form component for user input
│   ├── HealthResults.jsx    # Component to display analysis results
├── pages/                   # Next.js pages
│   ├── api/calculate.js     # API route for health calculations
│   ├── index.jsx            # Main page
├── public/                  # Static assets
│   ├── favicon.ico
├── styles/                  # Global styles
│   ├── globals.css          # Tailwind CSS and global styles
├── package.json             # Project dependencies and scripts
├── next.config.mjs          # Next.js configuration
├── README.md                # Project documentation
```

## Future Enhancements (Optional Features)

- **Temporary Storage**: Implement local storage or a lightweight database (e.g., SQLite) to save user entries temporarily.
- **PDF Download**: Add functionality to generate and download a PDF of the health analysis using a library like `jspdf` or a LaTeX-based solution.
- **User Authentication**: Allow users to create accounts and save their health history.
- **Advanced Recommendations**: Integrate a more sophisticated recommendation engine based on health conditions.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue on GitHub or contact the repository maintainer.

---

Built with ❤️ using Next.js and Tailwind CSS.
