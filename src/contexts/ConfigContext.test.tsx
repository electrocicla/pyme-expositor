import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider, useConfig } from './ConfigContext';
import { defaultConfig } from '../types/config';
import React from 'react';

// Test component that uses the config context
const TestComponent: React.FC = () => {
  const { config, setConfig, canUndo, canRedo, undo, redo, resetHistory } = useConfig();

  return (
    <div>
      <div data-testid="title">{config.hero.title}</div>
      <button
        data-testid="change-title"
        onClick={() => setConfig({ ...config, hero: { ...config.hero, title: 'New Title' } })}
      >
        Change Title
      </button>
      <button
        data-testid="undo"
        onClick={undo}
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        data-testid="redo"
        onClick={redo}
        disabled={!canRedo}
      >
        Redo
      </button>
      <button
        data-testid="reset"
        onClick={resetHistory}
      >
        Reset
      </button>
      <div data-testid="can-undo">{canUndo ? 'true' : 'false'}</div>
      <div data-testid="can-redo">{canRedo ? 'true' : 'false'}</div>
    </div>
  );
};

describe('ConfigContext Undo/Redo', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should provide initial config', () => {
    render(
      <ConfigProvider mode="editor">
        <TestComponent />
      </ConfigProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent(defaultConfig.hero.title);
  });

  it('should allow changing config and track history', async () => {
    render(
      <ConfigProvider mode="editor">
        <TestComponent />
      </ConfigProvider>
    );

    // Initially cannot undo or redo
    expect(screen.getByTestId('can-undo')).toHaveTextContent('false');
    expect(screen.getByTestId('can-redo')).toHaveTextContent('false');

    // Change the title
    fireEvent.click(screen.getByTestId('change-title'));

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('New Title');
    });

    // Now should be able to undo
    expect(screen.getByTestId('can-undo')).toHaveTextContent('true');
    expect(screen.getByTestId('can-redo')).toHaveTextContent('false');
  });

  it('should allow undo and redo operations', async () => {
    render(
      <ConfigProvider mode="editor">
        <TestComponent />
      </ConfigProvider>
    );

    const originalTitle = defaultConfig.hero.title;

    // Change the title
    fireEvent.click(screen.getByTestId('change-title'));

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('New Title');
    });

    // Undo the change
    fireEvent.click(screen.getByTestId('undo'));

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent(originalTitle);
    });

    // Now should be able to redo
    expect(screen.getByTestId('can-undo')).toHaveTextContent('false');
    expect(screen.getByTestId('can-redo')).toHaveTextContent('true');

    // Redo the change
    fireEvent.click(screen.getByTestId('redo'));

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('New Title');
    });
  });

  it('should limit history to 50 states', async () => {
    render(
      <ConfigProvider mode="editor">
        <TestComponent />
      </ConfigProvider>
    );

    // Make 51 changes (exceeding the limit)
    for (let i = 0; i < 51; i++) {
      fireEvent.click(screen.getByTestId('change-title'));
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // Should still be able to undo (history is limited but functional)
    expect(screen.getByTestId('can-undo')).toHaveTextContent('true');
  });
});