import { Monitor, Moon, Sun } from "lucide-react"
import { ThemeToggler } from "../animate-ui/primitives/effects/theme-toggler"
import { useAppearance } from "@/hooks/use-appearance"
import { Button } from "../animate-ui/components/buttons/button";

function BlogToggler() {

  const { appearance, updateAppearance } = useAppearance();

  const resolved =
    appearance === 'system' ? typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : appearance;
  return (
    <ThemeToggler

      theme={appearance}
      resolvedTheme={resolved}
      setTheme={updateAppearance}
      direction="ltr"
    >
      {({ effective, toggleTheme }) => {
        const nextTheme =
          effective === 'light' ? 'dark' : effective === 'dark' ? 'system' : 'light';

        return (
          <Button variant={'accent'} size={"sm"} onClick={() => toggleTheme(nextTheme)}>
            {effective === 'system' ? <Monitor /> : effective === 'dark' ? <Moon /> : <Sun />}
          </Button>
        );
      }}
    </ThemeToggler>
  );
}

export default BlogToggler