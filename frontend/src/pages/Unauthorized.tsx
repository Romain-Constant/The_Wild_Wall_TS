import styles from "./Unauthorized.module.css";

function Unauthorized() {
  return (
    <div className={styles.unauthorizedContainer}>
      <h1>You are not authorized to access this resource</h1>
    </div>
  );
}

export default Unauthorized;
