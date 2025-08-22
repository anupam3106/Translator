import React, { useState, useEffect } from 'react';
import { Form, TextArea, Button, Icon } from 'semantic-ui-react';
import axios from 'axios';

const API_URLS = {
  languages: 'https://libretranslate.com/languages',
  translate: 'https://libretranslate.com/translate'
};

const fallbackLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali'},
  { code: 'kn', name: 'Kannada'}
];

export default function Translate() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedLanguageKey, setLanguageKey] = useState('');
  const [languagesList, setLanguagesList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateText = async () => {
    setError('');
    setResultText('');

    if (!inputText || !selectedLanguageKey) {
      alert('Please select a language and enter text to translate.');
      return;
    }

    const data = {
      q: inputText,
      source: 'en',
      target: selectedLanguageKey,
      format: 'text',
      api_key: null
    };

    try {
      setLoading(true);
      const response = await axios.post(API_URLS.translate, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResultText(response.data.translatedText);
    } catch (err) {
      console.error('Translate request failed:', err);
      setError('Translation failed. Please check your network or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get(API_URLS.languages)
      .then((response) => {
        console.log('Languages API response:', response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setLanguagesList(response.data);
        } else {
          setError('API returned no languages. Using fallback.');
          setLanguagesList(fallbackLanguages);
        }
      })
      .catch((err) => {
        console.error('Languages fetch failed:', err);
        setError('Failed to load languages. Using fallback list.');
        setLanguagesList(fallbackLanguages);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-header">
      <h2 className="header">Anupam's Translator</h2>
      <Form>
        <Form.Field
          control={TextArea}
          placeholder="Type Text to Translate..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

        <select
          value={selectedLanguageKey}
          onChange={(e) => setLanguageKey(e.target.value)}
          disabled={loading || languagesList.length === 0}
        >
          <option value="">Please select language...</option>
          {languagesList.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>

        <Form.Field
          control={TextArea}
          placeholder="Your Result Translation..."
          value={resultText}
          readOnly
          style={{ marginTop: '10px' }}
        />

        <Button
          color="orange"
          size="large"
          onClick={translateText}
          disabled={loading || !inputText || !selectedLanguageKey}
        >
          <Icon name="translate" />
          {loading ? 'Translating...' : 'Translate'}
        </Button>
      </Form>
    </div>
  );
}
