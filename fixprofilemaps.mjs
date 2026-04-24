import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminProfile.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar imports
c = c.replace(
  "import { useState, useEffect, useRef } from \"react\";",
  `import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../utils/supabase/client";
import AddressAutocomplete from "../../components/maps/AddressAutocomplete";
import AddressCard from "../../components/profile/AddressCard";`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
