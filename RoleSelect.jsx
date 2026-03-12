import "./RoleSelect.css"


function RoleSelect({title, description, image, onClick, bullets, className}) {
    return( 
        <div className={`role-select ${className}`} onClick={onClick}>
            <div className="role-icon">
                {image}
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
            <ul className="role-list">
                {bullets.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
        </div>
    );
}

export default RoleSelect;