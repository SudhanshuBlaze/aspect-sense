import "./SubmitButton.css";
const SubmitButton = ({ handleSubmit }) => {
  return (
    <button
      type="submit"
      value="Submit"
      className="form-submit-button"
      onClick={handleSubmit}
    >
      Submit
    </button>
  );
};

export default SubmitButton;
