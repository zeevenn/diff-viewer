interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "w-8 h-8" }: LogoProps) => {
  return (
    <div className={className}>
      <img 
        src='/logo.svg' 
        alt="Diff Viewer Logo" 
        className="w-full h-full block dark:hidden"
      />
      <img 
        src='/logo-dark.svg' 
        alt="Diff Viewer Logo" 
        className="w-full h-full hidden dark:block"
      />
    </div>
  );
};
