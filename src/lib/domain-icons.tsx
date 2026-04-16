import React from "react";
import { 
  FcIdea, 
  FcDoughnutChart, 
  FcDatabase, 
  FcOrgUnit, 
  FcPrivacy, 
  FcGlobe, 
  FcShipped, 
  FcDepartment, 
  FcMoneyTransfer, 
  FcManager, 
  FcKindle, 
  FcReading, 
  FcElectronics, 
  FcBiotech, 
  FcFactory, 
  FcCommandLine,
  FcFinePrint,
  FcDecision,
  FcSearch,
  FcLineChart,
  FcBriefcase,
  FcGraduationCap,
  FcBullish,
  FcAutomotive,
  FcProcess,
  FcDataConfiguration,
  FcMindMap,
  FcFlashOn,
  FcAssistant,
  FcWorkflow
} from "react-icons/fc";

export const getDomainIcon = (domainName: string): React.ComponentType<any> => {
    const lower = domainName.toLowerCase();

    /* =====================================================
       1️⃣ DATA, AI & ANALYTICS
    ===================================================== */
    // Generative AI specifically
    if (lower.includes("generative ai") || lower.includes("llm") || lower.includes("gpt")) {
        return FcFlashOn;
    }

    // MLOps specifically
    if (lower.includes("mlops") || lower.includes("model operations")) {
        return FcWorkflow;
    }

    // AI / ML / Brain
    if (
        lower.includes("machine learning") ||
        lower === "ai" ||
        lower.includes("artificial intelligence") ||
        lower.includes("ml") ||
        lower.includes("brain")
    ) {
        return FcMindMap; 
    }

    if (
        lower.includes("data scientist") ||
        lower.includes("science")
    ) {
        return FcDoughnutChart;
    }

    if (
        lower.includes("computer science")
    ) {
        return FcGraduationCap;
    }

    if (
        lower.includes("data analyst") ||
        lower.includes("analytics") ||
        lower.includes("bi")
    ) {
        return FcLineChart;
    }

    if (
        lower.includes("data engineer") ||
        lower.includes("database") ||
        lower.includes("sql") ||
        lower.includes("etl")
    ) {
        return FcDatabase;
    }

    /* =====================================================
       2️⃣ MEDICAL & HEALTHCARE
    ===================================================== */
    if (
        lower.includes("medical") ||
        lower.includes("health") ||
        lower.includes("nurse") ||
        lower.includes("doctor") ||
        lower.includes("pharmacy") ||
        lower.includes("clinical") ||
        lower.includes("billing")
    ) {
        return FcBiotech; 
    }

    /* =====================================================
       3️⃣ MANUFACTURING & INDUSTRIAL
    ===================================================== */
    if (
        lower.includes("manufacturing") ||
        lower.includes("factory") ||
        lower.includes("industrial") ||
        lower.includes("mechanical") ||
        lower.includes("automotive")
    ) {
        return lower.includes("automotive") ? FcAutomotive : FcFactory;
    }

    /* =====================================================
       4️⃣ SUSTAINABILITY / ENVIRONMENT
    ===================================================== */
    if (
        lower.includes("sustainability") ||
        lower.includes("environment") ||
        lower.includes("esg") ||
        lower.includes("climate")
    ) {
        return FcGlobe;
    }

    /* =====================================================
       5️⃣ SECURITY & COMPLIANCE
    ===================================================== */
    if (
        lower.includes("cyber") ||
        lower.includes("security") ||
        lower.includes("infosec") ||
        lower.includes("privacy")
    ) {
        return FcPrivacy;
    }

    if (
        lower.includes("grc") ||
        lower.includes("risk") ||
        lower.includes("compliance")
    ) {
        return FcDecision;
    }

    /* =====================================================
       6️⃣ SUPPLY CHAIN / OPERATIONS
    ===================================================== */
    if (
        lower.includes("supply chain") ||
        lower.includes("logistics") ||
        lower.includes("warehouse") ||
        lower.includes("shipping")
    ) {
        return FcShipped;
    }

    /* =====================================================
       7️⃣ SOFTWARE / ENGINEERING
    ===================================================== */
    if (
        lower.includes("devops") ||
        lower.includes("sre") ||
        lower.includes("infrastructure") ||
        lower.includes("sysadmin") ||
        lower.includes("cloud")
    ) {
        return FcOrgUnit;
    }

    // Full Stack Specifically
    if (lower.includes("full stack") || lower.includes("fullstack")) {
        return FcDataConfiguration;
    }

    // Software Engineer vs Developer
    if (lower.includes("software engineer")) {
        return FcCommandLine;
    }

    if (
        lower.includes("software") ||
        lower.includes("developer") ||
        lower.includes("programmer") ||
        lower.includes("stack") ||
        lower.includes("engineer") ||
        lower.includes("web") ||
        lower.includes("backend") ||
        lower.includes("frontend") ||
        lower.includes("python") ||
        lower.includes("java") ||
        lower.includes("node")
    ) {
        return FcElectronics;
    }

    /* =====================================================
       8️⃣ QA / TESTING
    ===================================================== */
    if (
        lower.includes("qa") ||
        lower.includes("quality") ||
        lower.includes("test") ||
        lower.includes("automation")
    ) {
        return FcProcess;
    }

    /* =====================================================
       9️⃣ BUSINESS & ENTERPRISE ROLES
    ===================================================== */
    if (
        lower.includes("business analyst") ||
        lower.includes("workday") ||
        lower.includes("system analyst") ||
        lower.includes("strategy") ||
        lower.includes("consultant")
    ) {
        return FcDepartment;
    }

    if (
        lower.includes("finance") ||
        lower.includes("account") ||
        lower.includes("audit") ||
        lower.includes("tax") ||
        lower.includes("banking")
    ) {
        return FcMoneyTransfer;
    }

    if (
        lower.includes("hr") ||
        lower.includes("human resources") ||
        lower.includes("recruiter") ||
        lower.includes("talent") ||
        lower.includes("people")
    ) {
        return FcManager;
    }

    /* =====================================================
       🔟 CREATIVE & DESIGN
    ===================================================== */
    if (
        lower.includes("design") ||
        lower.includes("ux") ||
        lower.includes("ui") ||
        lower.includes("creative") ||
        lower.includes("art") ||
        lower.includes("product designer")
    ) {
        return FcKindle;
    }

    /* =====================================================
      1️⃣1️⃣ LEGAL
    ===================================================== */
    if (
        lower.includes("legal") ||
        lower.includes("law") ||
        lower.includes("contracts")
    ) {
        return FcReading;
    }

    /* =====================================================
      1️⃣2️⃣ OTHER SPECIALIZED
    ===================================================== */
    if (lower.includes("education") || lower.includes("teacher") || lower.includes("learning")) {
        return FcGraduationCap;
    }

    if (lower.includes("marketing") || lower.includes("sales") || lower.includes("advertising")) {
        return FcBullish;
    }

    /* =====================================================
       1️⃣3️⃣ FALLBACK
    ===================================================== */
    return FcBriefcase;
};
