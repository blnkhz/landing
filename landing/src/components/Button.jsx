export const Button = ({ onClick, text, disabled = false }) => {
  const color = disabled ? 'gray' : 'rose'

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-${color}-300 font-bold ${
        disabled ? '' : 'hover:shadow-[3px_3px_0_black] hover:text-white'
      } rounded border-1 border-black transition-all cursor-pointer`}
    >
      {text}
    </button>
  )
}
