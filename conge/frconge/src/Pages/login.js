
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // For navigation after login

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Declare errorMessage

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    //verifier l'@ et password 
    const formValidation = () => {
        let status = true;
        const localErrors = { ...errors }; // Create a copy to avoid mutation

        if (email === '') {
            localErrors.email = 'Email is required';
            status = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            localErrors.email = 'Invalid email format';
            status = false;
        }

        if (password === '' || password.length < 8) {
            localErrors.password = 'Password is required (minimum 8 characters)';
            status = false;
        }

        setErrors(localErrors);
        return status;
    };
    //envoyer les données au backend
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (formValidation()) {
            const data = {
                email,
                password,
            };
        try {
            const response = await axios.post('http://localhost:3000/users/signin', {// Le composant React envoie une requête POST au backend avec l'email et le mot de passe saisis par l'utilisateur. Le serveur, à son tour, vérifie ces informations en les comparant avec celles stockées dans la base de données.
                email,
                password,
            });
            // Handle successful login (e.g., store token, redirect)
            toast.success('User logged in successfully!');
            setEmail('');
            setPassword('');
            //ajouter un conteur pour compter le nmbr de tentatives
            

            // Handle successful login (e.g., store token in local storage, redirect to protected route)
            console.log('Login successful:', response.data);
            localStorage.setItem('user_data', JSON.stringify(response.data.user)); // sauvgarder les donnees du user pour l'utiliser lorsque il connect 
            localStorage.setItem('token', response.data.token);//token de type string
            navigate('/home'); // Example: Redirecting after login lil page home apres connection 
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');            }
        } else {
            console.log('Form validation failed');
        }
    };
    

    return (
        <div className="login-container">
            <Toaster /> {/* Render Toaster for displaying toast messages */}
            <div className="login-form">
                <h2>Enter your email and password</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                        <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                    <button type="submit">LOGIN</button>
                </form>
                <p>
                    Don't have an account? <a href="/sign-up">Sign up</a>
                </p>
            </div>
            <div className="login-image">
                <img src="/src/images/imglogin.jpeg" alt="Desk with laptop and coffee mug" />
            </div>
        </div>
    );
}
export default Login;
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import { toast, Toaster } from 'react-hot-toast'; // Import the toast and Toaster

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [attempts, setAttempts] = useState(0); // State to track login attempts

    // Verifier l'email et password
    const formValidation = () => {
        let status = true;
        const localErrors = { ...errors };

        if (email === '') {
            localErrors.email = 'Email is required';
            status = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            localErrors.email = 'Invalid email format';
            status = false;
        }

        if (password === '' || password.length < 8) {
            localErrors.password = 'Password is required (minimum 8 characters)';
            status = false;
        }

        setErrors(localErrors);
        return status;
    };

    // Envoyer les données au backend
    const handleLogin = async (e) => {
        e.preventDefault();
        if (formValidation()) {
            try {
                const response = await axios.post('http://localhost:3000/users/signin', {
                    email,
                    password,
                });
                toast.success('User logged in successfully!');
                setEmail('');
                setPassword('');

                // Store token and navigate to home page
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } catch (error) {
                console.error(error);
                setErrorMessage(error.response?.data?.message || 'Login failed');
                toast.error(error.response?.data?.message || 'Login failed');

                // Increment the attempts counter
                setAttempts(prevAttempts => prevAttempts + 1);

                // Check if attempts exceed 3
                if (attempts + 1 >= 3) {
                    toast.error('Too many failed attempts. Redirecting to home page.');
                    navigate('/');
                }
            }
        } else {
            console.log('Form validation failed');
        }
    };

    return (
        <div className="login-container">
            <Toaster />
            <div className="login-form">
                <h2>Enter your email and password</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                        <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit">LOGIN</button>
                </form>
                <p>
                    Don't have an account? <a href="/sign-up">Sign up</a>
                </p>
            </div>
            <div className="login-image">
                <img src="./images/imglogin.jpeg" alt="Desk with laptop and coffee mug" />
            </div>
        </div>
    );
}

export default Login;*/