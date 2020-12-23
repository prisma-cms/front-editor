import puppeteer from 'puppeteer'

import { toMatchImageSnapshot } from 'jest-image-snapshot'

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot })


/**
 * При кликах по кнопкам бывают эффекты, поэтому надо ставить 
 */
const sleep = (delay = 3000) => {

  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}


/**
 * Проверяем вставку реакт-компонентов в HTML-контент
 */

describe('ContentEditor', () => {
  it('Insert React Components in HTML', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto('https://google.com');

    // const logs = [];


    try {
      let error: Error | null = null

      page.on('console', (log) => {
        // eslint-disable-next-line no-console
        // console.log(log.type(), log.text())
        // console.log("args", log.args())

        switch (log.type()) {
          case 'debug':
            break

          case 'error':
            // throw new Error(log.text());
            if (!error) {
              error = new Error(log.text())
            } else {
              console.error(log.text())
            }
            break

          default:
            // eslint-disable-next-line no-console
            console.log(log.type(), log.text())
        }
      })

      /**
       * Загружаем страницу редактора
       */
      await page.goto('http://localhost:3000/content-editor')

      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      /**
       * Фиксируем редактор.
       * В дальнейшем все манипуляции с дочерними элементами должны быть именно с ним,
       * то есть инстанс не должен меняться.
       */
      const contentProxyStyled = await page.$('.ContentProxyStyled')

      expect(contentProxyStyled).toBeTruthy()

      /**
       * Toolbar тоже всегда должен быть и всегда один инстанс
       */
      const toolbar = await page.$('.ContentEditorToolbar')

      expect(toolbar).toBeTruthy()

      /**
       * Контейнер, в который выводится контент
       */
      // const contentProxyContent = await page.$('.ContentProxyContent')

      // expect(contentProxyContent).toBeTruthy()

      /**
       * Кнопка выставления режима редактирования HTML
       */

      const setEditModeHTMLButton = await toolbar?.$('[name=setEditModeHTML]')

      expect(setEditModeHTMLButton).toBeTruthy()

      /**
       * Кнопка выставления режима редактирования React
       */

      // const setEditModeReactButton = await toolbar?.$(
      //   '[name=setEditModeReact]'
      // )

      // expect(setEditModeReactButton).toBeTruthy()

      {
        /**
         * Этот компонент имеет ключ, по этой причине при переключении
         * режимов редактирования у нас создается новый DOM-элемент.
         * На каждом этапе редактирования следует использовать свою переменную
         * во избежания коллизий с контентом.
         */
        const contentProxyEditor = await contentProxyStyled?.$(
          '.contentProxyEditor'
        )

        expect(contentProxyEditor).toBeTruthy()

        /**
         * Пока не перевели в режим редактирования,
         * редактируемой области не должно быть
         */
        expect(await contentProxyEditor?.evaluate(node => node.attributes.getNamedItem("contenteditable")?.value)).toBe("false")


        /**
         * Фиксируем начальный контент
         */
        expect(
          await contentProxyEditor?.evaluate((node) => node.outerHTML)
        ).toMatchSnapshot('contentProxyContent initial HTML')
      }

      {
        /**
         * Находим кнопку сейва
         */

        const saveButton = await toolbar?.$(
          '.TagEditorToolbar--iconButton.save'
        )

        /**
         * Сейчас еще кнопки не должно быть, потому что прежде
         * надо включить режим редактирования
         */
        expect(saveButton).not.toBeTruthy()
      }

      /**
       * Переводим в режим редактирования HTML
       */

      await setEditModeHTMLButton?.click()
      await sleep();


      expect(
        await setEditModeHTMLButton?.evaluate((node) => node.outerHTML)
      ).toMatchSnapshot('setEditModeHTMLButton active')


      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      /**
       * Добавляем новый HTML контент в редактируемую область
       */
      {
        const contentProxyEditor = await page.$('.contentProxyEditor')

        expect(contentProxyEditor).toBeTruthy()

        /**
         * HTML редактора до манипуляций с ним
         */
        const contentProxyEditorInitialHTML = await contentProxyEditor?.evaluate(
          (node) => {
            return node.innerHTML
          }
        )

        expect(contentProxyEditorInitialHTML).toMatchSnapshot(
          'contentProxyEditorInitialHTML'
        )

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Добавляем новый контент в редактируемую область
         */
        const contentProxyEditorUpdatedHTML = await contentProxyEditor?.evaluate(
          (node) => {
            const div = document.createElement('div')
            div.id = 'NewDiv1'

            div.innerHTML = `<p id="NewP1">NewContent1</p><p id="NewP2">NewContent2</p><p id="NewP3">NewContent3</p>`

            node.appendChild(div)

            return node.innerHTML
          }
        )

        expect(await contentProxyEditor?.$('#NewDiv1')).toBeTruthy()

        expect(contentProxyEditorUpdatedHTML).toMatchSnapshot(
          'contentProxyEditorUpdatedHTML'
        )

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()
      }

      /**
       * Находим кнопку сохранения
       */

      {

        const contentProxyEditor = await contentProxyStyled?.$(
          '.contentProxyEditor'
        )

        expect(contentProxyEditor).toBeTruthy()


        const saveButton = await toolbar?.$(
          '.TagEditorToolbar--iconButton.save'
        )

        /**
         * Сейчас еще кнопки не должно быть, потому что прежде
         * надо включить режим редактирования
         */
        expect(saveButton).toBeTruthy()

        /**
         * Жмем кноку сохранения
         */
        await saveButton?.click()
        await sleep();

        /**
         * Делаем снимок
         */
        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Фиксируем итоговый HTML
         */
        expect(
          await contentProxyEditor?.evaluate((node) => node.outerHTML)
        ).toMatchSnapshot('contentProxyContent updated HTML')
      }

      /**
       * Проверяем вставку React-компонентов
       */
      {

        const contentProxyEditor = await contentProxyStyled?.$(
          '.contentProxyEditor'
        )

        expect(contentProxyEditor).toBeTruthy()


        /**
         * По умолчанию все кнопки кроме переключения режимов редактирования
         * должны быть неактивными
         */
        expect((await toolbar?.$$('button:enabled'))?.length).toBe(1)
        expect(
          (await toolbar?.$$('button:disabled'))?.length
        ).toBeGreaterThan(0)

        /**
         * Кнопка вставки секции
         */
        const insertSectionButton = await toolbar?.$(
          'button[name=addSection]'
        )

        expect(insertSectionButton).toBeTruthy();

        expect(await insertSectionButton?.evaluate((node) => node.attributes.getNamedItem("disabled")?.value)).toBe("");


        /**
         * Переключаемся в режим редактирования (Нет)
         */
        // await setEditModeHTMLButton?.click()


        /**
         * Фокусируемся в редактор
         */
        // const contentProxyEditor = await page.$('.contentProxyEditor')

        // expect(contentProxyEditor).not.toBeTruthy()

        /**
         * Проверяем что элемент редактируемый
         */
        // expect(
        //   await contentProxyEditor?.evaluate((node) =>
        //     node.getAttribute('contentEditable')
        //   )
        // ).toBe('true')

        /**
         * Проверяем, чтобы не был фокус на этом элементе
         */
        // expect(
        //   await contentProxyEditor?.evaluate(
        //     (node) => node === document.activeElement
        //   )
        // ).toBe(false)


        /**
         * Выделяем конкретные элементы и удаляем их.
         */

        expect(await contentProxyEditor?.evaluate(node => node.outerHTML)).toMatchSnapshot('NewDiv1 outerHTML expect 3 childs contentProxyEditor')

        {
          const contentProxyEditor = await contentProxyStyled?.$(
            '.contentProxyEditor'
          )

          expect(await contentProxyEditor?.evaluate(node => node.outerHTML)).toMatchSnapshot('NewDiv1 outerHTML expect 3 childs contentProxyEditor')
        }

        const NewDiv1 = await contentProxyEditor?.$('#NewDiv1')

        expect(NewDiv1).toBeTruthy()


        expect(await NewDiv1?.evaluate(node => node.outerHTML)).toMatchSnapshot('NewDiv1 outerHTML expect 3 childs')

        /**
         * Ожидаем 3 дочерних элемента
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(3)

        /**
         * Берем два дочерних элемента
         */
        const P1 = await NewDiv1?.$('#NewP1')
        const P2 = await NewDiv1?.$('#NewP2')

        expect(P1).toBeTruthy()
        expect(P2).toBeTruthy()

        /**
         * Выделяем эти элементы
         */
        if (P1 && P2) {
          await page.evaluate(
            (from, to) => {
              const selection = from.getRootNode().getSelection()
              const range = document.createRange()
              range.setStartBefore(from)
              range.setEndAfter(to)
              selection.removeAllRanges()
              selection.addRange(range)
            },
            P1,
            P2
          )
        }

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Проверяем, что есть выделенные элементы.
         * При этом кнопка вставки секции не должна быть активной.
         */
        expect(await page.evaluate(() => document.getSelection()?.rangeCount)).toBeGreaterThan(0);
        expect(await insertSectionButton?.evaluate((node) => node.attributes.getNamedItem("disabled")?.value)).toBe("");


        /**
         * Сбрасываем ранж и вставляем секцию
         */
        const selectionType = await page.evaluate(() => {
          document.getSelection()?.getRangeAt(0).collapse();
          return document.getSelection()?.type;
        });

        expect(selectionType).toBe("Caret");

        expect(await insertSectionButton?.evaluate((node) => node.attributes.getNamedItem("disabled")?.value)).toBe(undefined);

        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()

        /**
         * Фиксируем кол-во дочерних компонентов в контейнере
         */

        let childsCount = await NewDiv1?.evaluate(node => node.childElementCount) || 0;

        expect(await NewDiv1?.evaluate(node => node.outerHTML)).toMatchSnapshot("Check NewDiv1 childs count");

        /**
         * Вставляем секцию
         */
        await insertSectionButton?.click();
        await sleep();
        childsCount++;


        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()


        expect(await NewDiv1?.evaluate(node => node.outerHTML)).toMatchSnapshot("Check NewDiv1 childs count");

        /**
         * Проверяем кол-во дочерних элементов
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(childsCount)


        /**
         * Вставляем еще секцию (проверяем на задвоение действия)
         */
        await insertSectionButton?.click();
        await sleep();
        childsCount++;


        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()


        /**
         * Проверяем кол-во дочерних элементов
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(childsCount)


        /**
         * Вставляем еще секцию (проверяем на задвоение действия)
         */
        await insertSectionButton?.click();
        await sleep();
        childsCount++;


        expect(
          await page.screenshot({
            fullPage: true,
          })
        ).toMatchImageSnapshot()



        /**
         * Проверяем кол-во дочерних элементов
         */
        expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(childsCount)

        /**
         * Удаляем выделенные элементы
         */
        // await page.keyboard.press('Delete')

        // expect(
        //   await page.screenshot({
        //     fullPage: true,
        //   })
        // ).toMatchImageSnapshot()

        /**
         * Проверяем, что остался только один потомок
         */
        // expect((await NewDiv1?.$$(':scope > *'))?.length).toBe(1)


        /**
         * Сейчас у нас каретка на месте удаленных элементов.
         * Вставляем Реакт-компонент.
         */

        /**
         * Получаем ноду, в которую будем вставлять элемент
         */

        // const focusNode = await page.evaluate(() => document.getSelection()?.focusNode);

        // console.log('focusNode', focusNode);

        // expect(focusNode).toBeTruthy();


        // const newItem = await focusNode?.evaluate((node: HTMLDivElement) => {

        //   const div = document.createElement('div');

        //   div.innerHTML = "sdfsdfdsf"

        //   node.appendChild(div);

        //   return div.outerHTML;
        // });

        // const documentHandle = await page.evaluateHandle('document');

        // const newItem = await page?.evaluate(() => {

        //   const div = document.createElement('div');

        //   div.innerHTML = "sdfsdfdsf"

        //   // console.log("Section", window.Section);

        //   // const section = new Section({
        //   //   mode: "main",
        //   //   object: {
        //   //     name: "Section",
        //   //     component: "Section",
        //   //     components: [],
        //   //     props: {},
        //   //   },
        //   // });

        //   // div.reactComponent

        //   const focusNode = document.getSelection()?.focusNode


        //   /**
        //    * Если фокус-нода - Text, то в нее нельзя вставить элемент.
        //    */
        //   let node = focusNode;

        //   if (node?.nodeType === Node.TEXT_NODE) {
        //     node = node.parentNode;
        //   }

        //   node?.appendChild(div);

        //   // const element = focusNode.asElement();
        //   // console.log('element', element);


        //   // node.appendChild(div);

        //   return div.outerHTML;
        // });

        // expect(newItem).toMatchSnapshot('Insert React newItem')
        // expect(await NewDiv1?.evaluate(node => node.outerHTML)).toMatchSnapshot('Insert React newItem NewDiv1')


        // expect(
        //   await page.screenshot({
        //     fullPage: true,
        //   })
        // ).toMatchImageSnapshot()

        // /**
        //  * Сохраняем изменения
        //  */

        // const saveButton = await toolbar?.$(
        //   '.TagEditorToolbar--iconButton.save'
        // )

        // await saveButton?.click()

        // expect(
        //   await page.screenshot({
        //     fullPage: true,
        //   })
        // ).toMatchImageSnapshot()

        /**
         * Логируем измененный контент
         */
        expect(
          await contentProxyEditor?.evaluate((node) => node.outerHTML)
        ).toMatchSnapshot('contentProxyEditor after remove 2 nodes')
      }

      /**
       * Делаем итоговый снимок страницы
       */
      expect(
        await page.screenshot({
          fullPage: true,
        })
      ).toMatchImageSnapshot()

      expect(error).not.toBeTruthy()
    } finally {
      await browser.close()
    }
  })
})
