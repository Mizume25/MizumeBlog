import { Switch } from "@/components/ui/switch";
import { Lang } from "@/store/lang-store";
interface LanguagueSwitchProps {
    lang: string
    onLang: (v : Lang) => void
}

export function LanguagueSwitch({ lang ,onLang } : LanguagueSwitchProps) {
  return (
        <Switch name="default" style={{ color: "#ffffff"}} onValueChange={(v) => onLang(v as Lang)}  >
          <Switch.Control  value="es" label="ES" defaultChecked={lang === "es"}  />
          <Switch.Control  value="en" label="EN" defaultChecked={lang === "en"} />
        </Switch>
  );
}

export default LanguagueSwitch
