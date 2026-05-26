import "./UnderConstruction.css";
import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <div className="uc">

      <div className="uc__card">

        <div className="uc__icon">
          🚧
        </div>

        <h1>
          Feature Under Construction
        </h1>

        <p>
          We're currently building
          this feature for ApexChat AI.
          It will be available soon.
        </p>

        <Link
          to="/dashboard"
          className="uc__btn"
        >
          Back to Dashboard
        </Link>

      </div>

    </div>
  );
};

export default UnderConstruction;