
import expect from 'expect'

import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from "prop-types";

import chalk from 'chalk';



describe('@prisma-cms/tests index', () => {
  let node


  beforeEach(() => {
    node = document.createElement('root')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })



  it('ServiceWorker', () => {

    const {
      TEST_WORKERS,
    } = process.env;


    return new Promise((testSuccess) => {



      if (TEST_WORKERS) {
        const {
          register: serviceWorkerRegister,
          unregister: serviceWorkerUnregister,
        } = require("../serviceWorker");

        class ServiceWorker {

          constructor() {

            const instance = {

              unregister: async () => {
                console.log("unregister");

                testSuccess();
              }

            }

            this.ready = new Promise(resolve => {
              console.log(chalk.green("serviceWorker ready"));


              resolve(instance);
            });

          }

          controller = {}


          async register() {

            console.log("serviceWorker register");
            console.log("serviceWorker register 2");

            class registration {

            }

            const registrationInstance = new registration()

            registrationInstance.installing = {
              state: "installed",
            }

            setTimeout(() => {


              const {
                onupdatefound,
                installing,
              } = registrationInstance;


              if (onupdatefound) {
                onupdatefound();

                const {
                  onstatechange,
                } = installing;


                onstatechange();
              }

            }, 100);

            return registrationInstance

          }


        }


        const serviceWorker = new ServiceWorker();

        navigator.serviceWorker = serviceWorker;

        const OriginalEnv = process.env.NODE_ENV;

        process.env.NODE_ENV = "production";


        serviceWorkerRegister({
          onUpdate: (registration) => {
            console.log("serviceWorkerRegister.onUpdate.registration", registration);

            // unregister
            serviceWorkerUnregister();
          },
        });

        window.dispatchEvent(new Event("load"));

        process.env.NODE_ENV = OriginalEnv;

      }
      else {
        console.log("Test rowrkers skipped");
        return testSuccess();
      }

    });

  });


})

