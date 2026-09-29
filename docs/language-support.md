# HRKVoice — Multilingual Indian Language Registry

HRKVoice provides first-class support for all 22 official languages listed in the Eighth Schedule of the Constitution of India, plus Indian English.

---

## Supported Languages Table

| # | Language | Native Name | Script | ISO Code | Locales | Code-Switching |
|---|----------|-------------|--------|----------|---------|----------------|
| 1 | English | English | Latin | `en` | `en-IN`, `en-US` | Yes (Hinglish, etc.) |
| 2 | Hindi | हिन्दी | Devanagari | `hi` | `hi-IN` | Yes |
| 3 | Gujarati | ગુજરાતી | Gujarati | `gu` | `gu-IN` | Yes |
| 4 | Bengali | বাংলা | Bengali | `bn` | `bn-IN`, `bn-BD`| Yes |
| 5 | Marathi | मराठी | Devanagari | `mr` | `mr-IN` | Yes |
| 6 | Tamil | தமிழ் | Tamil | `ta` | `ta-IN`, `ta-LK`| Yes |
| 7 | Telugu | తెలుగు | Telugu | `te` | `te-IN` | Yes |
| 8 | Kannada | ಕನ್ನಡ | Kannada | `kn` | `kn-IN` | Yes |
| 9 | Malayalam | മലയാളം | Malayalam | `ml` | `ml-IN` | Yes |
| 10 | Punjabi | ਪੰਜਾਬੀ | Gurmukhi | `pa` | `pa-IN` | Yes |
| 11 | Odia | ଓଡ଼ିଆ | Odia | `or` | `or-IN` | Yes |
| 12 | Assamese | অসমীয়া | Bengali-Assamese | `as` | `as-IN` | Yes |
| 13 | Urdu | اردو | Perso-Arabic | `ur` | `ur-IN`, `ur-PK`| Yes |
| 14 | Sanskrit | संस्कृतम् | Devanagari | `sa` | `sa-IN` | No |
| 15 | Nepali | नेपाली | Devanagari | `ne` | `ne-IN`, `ne-NP`| Yes |
| 16 | Konkani | कोंकणी | Devanagari | `kok` | `kok-IN` | Yes |
| 17 | Maithili | मैथिली | Devanagari | `mai` | `mai-IN` | Yes |
| 18 | Dogri | डोगरी | Devanagari | `doi` | `doi-IN` | Yes |
| 19 | Kashmiri | کٲشُر / कश्मीरी | Perso-Arabic / Deva | `ks` | `ks-IN` | Yes |
| 20 | Sindhi | سنڌي / सिन्धी | Perso-Arabic / Deva | `sd` | `sd-IN` | Yes |
| 21 | Manipuri | মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ | Meitei Mayek / Beng | `mni` | `mni-IN` | Yes |
| 22 | Bodo | बड़ो | Devanagari | `brx` | `brx-IN` | Yes |
| 23 | Santali | ᱥᱟᱱᱛᱟᱲᱤ / संताली | Ol Chiki / Deva | `sat` | `sat-IN` | Yes |

---

## Code-Switching & Romanized Indian Speech

When users speak naturally in mixed languages:
- **Spoken**: *"bhai kal client ko website ka demo send kar dena"*
- **Output**: *"Bhai kal client ko website ka demo send kar dena."*

HRKVoice will NOT forcibly translate speech into pure English unless explicitly directed by setting Output Language to `English` or speaking *"Translate this to English"*.

Technical terms like `React`, `Node.js`, `API`, `GitHub`, `PostgreSQL`, `Tailwind CSS`, and `JSON` are automatically safeguarded and retained with exact developer casing.
