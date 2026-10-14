import { Switch } from "@/components/ui/switch";
import { type LANG_TYPE } from "@/layouts/app/blog-sidebar";
interface LanguagueSwitchProps {
    lang: string
    onLang: (v : LANG_TYPE) => void
}

export function LanguagueSwitch({ lang ,onLang } : LanguagueSwitchProps) {
  return (
        <Switch name="default" style={{ color: "#ffffff"}} onValueChange={(v) => onLang(v as LANG_TYPE)}  >
          <Switch.Control  value="es" label="ES" defaultChecked={lang === "es"}  />
          <Switch.Control  value="en" label="EN" defaultChecked={lang === "en"} />
        </Switch>
  );
}

export default LanguagueSwitch
