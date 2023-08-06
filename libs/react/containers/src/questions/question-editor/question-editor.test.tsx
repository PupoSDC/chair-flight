import { composeStories } from '@storybook/react';
import * as stories from './question-editor.stories';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { default as userEvent } from '@testing-library/user-event';
import { decorators } from '../../__tests__/decorators'
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { useEffect, useState } from 'react';
import { getWorker } from 'msw-storybook-addon';

const { BasePage, VariantSTupid } = composeStories(stories, { decorators });

describe('QuestionEditor', () => {


    it('is possible to create a new variant', async () => {
        render(<BasePage />);

        const loading = screen.getByText("Loading...");
        await waitForElementToBeRemoved(loading);



        //const initialCards = await screen.findAllByTestId('variant-card');
        //const addButton = screen.getByRole('button', { name: /new variant/i });
        //await userEvent.click(addButton,);
        //const newCards = await screen.findAllByTestId('variant-card');
        //expect(initialCards.length + 1).toBe(newCards.length);
    });

    it.only("works with really simple case", async () => {

        render(<VariantSTupid />);

        //getWorker().listHandlers();
    
        await screen.findByText("potato");
        await screen.findByText("starting");
       // await waitForElementToBeRemoved(loading);

    })
});

