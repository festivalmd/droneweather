# Project Brief: Aero Drone Flight Analysis

## Overview
Aero is a web application that helps drone pilots determine if they can safely fly their DJI drones at a specific location. The application analyzes weather conditions, local restrictions, and drone technical capabilities to provide a flight safety assessment.

## Core Requirements

### Primary Functionality
- Allow users to input a location (city/country)
- Allow users to select their DJI drone model
- Analyze flight feasibility based on:
  - Current weather conditions (wind speed, temperature, visibility)
  - Drone technical specifications (max wind resistance, etc.)
  - Local laws and regulations for drone flights

### User Experience Goals
- Simple, intuitive interface with clear visual feedback
- Real-time or near-real-time data analysis
- Clear safety status indicators (green/yellow/red)
- Mobile-responsive design
- Fast loading and smooth animations

## Target Audience
- DJI drone pilots (hobbyists and professionals)
- Users worldwide (UI in Russian language)
- Pilots who want to check flight conditions before going out

## Technical Scope
- Frontend-only MVP (static UI with mock data initially)
- Future: Integration with weather APIs and drone regulation databases
- Dark theme with modern, aerospace-inspired design
- Smooth animations for enhanced UX

## Current State
- UI components built with shadcn/ui
- Static dashboard with mock weather and drone data
- No backend API integration yet
- Ready for API integration phase