import React from 'react';
import '../stylesheets/Frame.css'

interface NavigationProps {
    title: string;
    children: React.ReactNode;
}

interface TitleProps {
    title: string;
}

const Navigation: React.FC<NavigationProps> = ({title, children}) => {
    return (
        <div className="navigation">
            <h3>{title}</h3>
            {children}
        </div>
    );
}

const Information: React.FC<TitleProps> = ({title}) => {
    return (
        <div className="information">
            <h1>{title}</h1>
        </div>
    );
}

const HugFrame: React.FC<{children: React.ReactNode }> = ({children}) => {
    return (
        <div className="hug-frame">
            {children}
        </div>
    );
}

export { Navigation, Information, HugFrame }