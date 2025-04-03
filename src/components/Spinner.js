const Spinner = ({ size = "md" }) => {
  const sizeClass =
    {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    }[size] || "w-8 h-8"

  return (
    <div className={`spinner ${sizeClass}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner

