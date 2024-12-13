const ButtonWithIcon = ({
  onClick,
  isActive,
  icon,
  className,
  extraClasses,
}) => (
  <button
    className={`border border-slate-400 rounded-full w-10 h-10 flex justify-center items-center ${
      isActive ? className : "bg-transparent"
    } ${extraClasses}`}
    onClick={onClick}
  >
    <i className={icon} />
  </button>
);

export default ButtonWithIcon;
