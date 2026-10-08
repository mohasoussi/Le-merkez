import { z } from "zod";

// Messages d'erreur par défaut en français (navigateur et serveur).
z.config(z.locales.fr());

export { z };
