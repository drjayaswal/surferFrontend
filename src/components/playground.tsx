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
  Cog,
} from "lucide-react";
import { Slider } from "./ui/slider";

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
    <div className="max-w-[92rem] mx-auto px-6 py-16 space-y-12">
      {/* Top Grid: Settings + Response */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Settings Panel */}
        <Card className="px-8 pt-8 border-0 bg-white/80 shadow-xl rounded-2xl">
          <div className="flex items-center space-x-3 mb-1">
            <Settings className="h-6 w-6 text-sky-700" />
            <h3 className="text-2xl font-semibold text-sky-700">
              Model Settings
            </h3>
          </div>

          {/* Temperature */}
          <div className="mb-2">
            <Label className="text-base font-semibold text-sky-600 mb-2 block">
              Temperature: {temperature[0]}
            </Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={2}
              min={0}
              step={0.1}
            />
            <p className="text-sm text-sky-600/70 font-light mt-2">
              (0 = focused, 2 = creative)
            </p>
          </div>

          {/* Max Tokens */}
          <div className="mb-2">
            <Label className="text-base font-semibold text-sky-600 mb-2 block">
              Max Tokens: {maxTokens[0]}
            </Label>
            <Slider
              value={maxTokens}
              onValueChange={setMaxTokens}
              max={500}
              min={50}
              step={10}
            />
            <p className="text-base text-sky-600/70 font-light mt-2">
              {maxTokens} length of response
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 py-5 text-lg bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 text-white hover:shadow-xl transition-all rounded-xl disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Cog className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-sky-600 hover:bg-sky-100 rounded-full"
            >
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="lg:col-span-2 px-8 py-8 bg-white/80 shadow-xl rounded-2xl border-0">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-sky-700" />
            <h3 className="text-2xl font-semibold text-sky-700">AI Response</h3>
            {output && (
              <span className="ml-2 text-lg text-sky-600/70">
                ({output.length} tokens)
              </span>
            )}
            {isGenerating && (
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                <span className="text-lg text-sky-600">Generating...</span>
              </div>
            )}
          </div>

          <div className="min-h-[220px] p-5 rounded-xl border border-sky-100 shadow-inner items-center justify-center">
            {output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base text-sky-700 whitespace-pre-wrap leading-relaxed"
              >
                {output}
              </motion.div>
            ) : (
              <p className="text-gray-400 italic">
                AI response will appear here...
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Prompt Input Section */}
      <Card className="px-8 py-8 bg-white/80 shadow-xl rounded-2xl border-0">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-sky-700" />
          <h3 className="text-2xl font-semibold text-sky-700">Your Prompt</h3>
          {prompt.length > 0 && (
            <span className="ml-2 text-lg text-sky-600/70">
              ({prompt.length} characters)
            </span>
          )}
        </div>
        <Textarea
          placeholder="Type your creative or technical prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="md:text-xl min-h-[80px] focus-visible:ring-0 border-dotted border-0 placeholder:text-gray-500 placeholder:italic bg-transparent shadow-none border-sky-600/20"
        />
      </Card>
    </div>
  );
}
