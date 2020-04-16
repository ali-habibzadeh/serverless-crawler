#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AlexaStack } from '../lib/alexa-stack';

const app = new cdk.App();
new AlexaStack(app, 'AlexaStack');
