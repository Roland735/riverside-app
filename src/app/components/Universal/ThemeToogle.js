"use client";
import React, { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

function ThemeToogle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handleThemeToggle = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <div onClick={handleThemeToggle}>
            {darkMode ? <BsSunFill /> : <FaMoon />}
        </div>
    );
}

export default ThemeToogle;
