"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  RotateCcw,
  Settings,
  Zap,
  Brain,
  FileText,
  RotateCw,
} from "lucide-react";
import { Slider } from "./ui/slider";

interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export default function InteractiveAIPlayground() {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([150]);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setOutput("");

    const responses = [
      "This is a simulated response from the AI model. The actual implementation would connect to the selected AI model with the specified parameters.",
      "Based on your prompt and the current settings, here's what the AI would generate. Temperature affects creativity, while max tokens controls length.",
      "The AI playground allows you to experiment with different models and parameters to see how they affect the output quality and style.",
    ];

    const selectedResponse =
      responses[Math.floor(Math.random() * responses.length)];

    for (let i = 0; i <= selectedResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      setOutput(selectedResponse.slice(0, i));
    }

    setIsGenerating(false);
  };

  const handleReset = () => {
    setPrompt("");
    setOutput("");
    setTemperature([0.7]);
    setMaxTokens([150]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Top Grid: Settings + Response */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="px-6 pb-6 border-0 bg-white/60 backdrop-blur-md shadow-xl">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-medium text-sky-600">Model Settings</h3>
          </div>

          {/* Temperature */}
          <div className="text-sky-600">
            <Label className="text-sm font-medium mb-2 block">
              Temperature: {temperature[0]}
            </Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={2}
              min={0}
              step={0.1}
            />
            <p className="text-xs text-sky-600 font-light mt-2">
              Controls randomness (0 = focused, 2 = creative)
            </p>
          </div>

          {/* Max Tokens */}
          <div className="text-sky-600">
            <Label className="text-sm font-medium block mb-2">
              Max Tokens: {maxTokens[0]}
            </Label>
            <Slider
              value={maxTokens}
              onValueChange={setMaxTokens}
              max={500}
              min={50}
              step={10}
            />
            <p className="text-xs text-sky-600 font-light mt-2">
              Maximum length of the response
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 hover:bg-sky-600 text-white shadow-none hover:shadow-lg hover:rounded-4xl rounded-lg duration-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </Button>
            <Button
              variant="outline"
              className="text-sky-500 shadow-none border-0 bg-transparent rounded-none hover:bg-transparent hover:animate-spin cursor-pointer"
              onClick={handleReset}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="p-6 lg:col-span-2 space-y-4 border-0 bg-transparent shadow-none">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-medium text-sky-600">AI Response</h3>
            {output && (
              <div className="mt-1 text-xs text-sky-600">
                <span className="font-medium">with {output.length} tokens</span>
              </div>
            )}
            {isGenerating && (
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                <span className="text-sm text-sky-600">Generating...</span>
              </div>
            )}
          </div>

          <div className="h-full p-4 bg-transparent rounded-lg">
            {output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sky-600/60 font-light whitespace-pre-wrap"
              >
                {output}
              </motion.div>
            ) : (
              <div className="text-gray-400 italic">
                AI response will appear here...
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Prompt Input Full Width */}
      <Card className="p-6 lg:col-span-3 border-0 bg-white/60 backdrop-blur-md shadow-xl">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-sky-600" />
          <h3 className="text-lg font-medium text-sky-600">Your Prompt</h3>
          {prompt.length > 0 && (
            <span className="mt-1 text-xs text-sky-600">
              with {prompt.length} characters
            </span>
          )}
        </div>
        <Textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none focus-visible:ring-0 border-dotted border-0 placeholder:text-gray-500 placeholder:italic shadow-none border-sky-600/20 placeholder:text-md"
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span className="text-sky-600/60">
            Press Shift+Enter for New Line
          </span>
        </div>
      </Card>
    </div>
  );
}
